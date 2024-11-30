const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { mockDeep, mockReset, mock } = require('jest-mock-extended');
const prisma = require('../database/prismaClient');
const userController = require('../app/user/user.controller');

// Mock external modules
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const mockPrisma = prisma;

console.log(process.env.NODE_ENV);


describe('User Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        name: 'Test User',
        email: 'test@test.com',
        password: 'Password123!'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    mockReset(mockPrisma);
  });

  describe('create', () => {
    const mockCreatedUser = {
      id: 1,
      name: 'Test User',
      email: 'test@test.com',
      password: 'hashedPassword123',
      organizationId: 1
    };

    beforeEach(() => {
      bcrypt.hash.mockResolvedValue('hashedPassword123');
      jwt.sign.mockReturnValue('mockToken');
      mockPrisma.user.create.mockResolvedValue(mockCreatedUser);
    });

    it('should create a new user successfully', async () => {
      await userController.create(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('Password123!', 10);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Test User',
          email: 'test@test.com',
          password: 'hashedPassword123'
        })
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 1, email: 'test@test.com' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ token: 'mockToken' });
    });

  });

  describe('login', () => {
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@test.com',
      password: 'hashedPassword123',
      organizationId: 1
    };

    beforeEach(() => {
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockToken');
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    });

    it('should login a user successfully', async () => {
      req.body = {
        email: 'test@test.com',
        password: 'Password123!'
      };

      await userController.login(req, res);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@test.com' }
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('Password123!', 'hashedPassword123');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 1, email: 'test@test.com' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: 'mockToken' });
    });

    it('should handle invalid credentials', async () => {
      bcrypt.compare.mockResolvedValue(false);

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });
  });

  describe('get', () => { 
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@gmail.com',
      organizationId: 1
    };

    beforeEach(() => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    });
      
    it('should get a user successfully', async () => { 
      req = {
        user: { id: 1 },
        params: {id: 1}
      };
      
      await userController.get(req, res);
      
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    }); 
     
    it('should handle user not found', async () => { 
      mockPrisma.user.findUnique.mockResolvedValue(null);
      
      req = {
        user: { id: 1 },
        params: {id: 1}
      };
      
      await userController.get(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should handle error', async () => { 
      mockPrisma.user.findUnique.mockRejectedValue(new Error('random error'));
      
      req = {
        user: { id: 1 },
        params: {id: 1}
      };
      
      await userController.get(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to retrieve user' });
    });
  });


  describe('getAll', () => {
    const mockUsers = [
      {
        id: 1,
        name: 'Test User 1',
        email: 'test@gmail.com'
      }];
    
    beforeEach(() => {
      mockPrisma.user.findMany.mockResolvedValue(mockUsers);
    });

    it('should get all users successfully', async () => {
      await userController.getAll(req, res);

      expect(mockPrisma.user.findMany).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should handle error', async () => { 
      mockPrisma.user.findMany.mockRejectedValue(new Error('Failed to retrieve users'));
      
      await userController.getAll(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to retrieve users' });
    });

  });

  describe('update', () => {
    const mockUpdatedUser = {
      id: 1,
      name: 'Updated User',
      email: 'updated@test.com',
      password: 'newHashedPassword',
      organizationId: 1
    };

    beforeEach(() => {
      bcrypt.hash.mockResolvedValue('newHashedPassword');
    });

    it('should update a user successfully', async () => {

      mockPrisma.user.update.mockResolvedValue(mockUpdatedUser);
 
      req = {
        body: {
          name: 'Updated User',
          email: 'updated@test.com',
          organizationId: 1
        },
        user: { id: 1 },
        params: { id: '1' }
      };
      
      await userController.update(req, res);

      // expect(bcrypt.hash).toHaveBeenCalledWith('NewPassword123!', 10);
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          name: 'Updated User',
          email: 'updated@test.com',
        })
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({token: 'mockToken'});
    });

    it('should handle user not found', async () => {

      req = {
        body: {
          name: 'Updated User',
          email: 'updated@test.com',
          organizationId: 1
        },
        user: { id: 1 },
        params: { id: '1' }
      };

      mockPrisma.user.update.mockRejectedValue(new Error('User not found'));

      await userController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update user' });
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      mockPrisma.user.delete.mockResolvedValue({});
    });

    it('should delete a user successfully', async () => {
      req.params = { id: '1' };

      await userController.remove(req, res);

      expect(mockPrisma.user.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith();
    });

    it('should handle user not found', async () => {
      mockPrisma.user.delete.mockRejectedValue(new Error('User not found'));

      req.params = { id: '1' };
      await userController.remove(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to delete user' });
    });
  });
});