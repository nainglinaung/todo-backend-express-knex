const { mockDeep, mockReset } = require('jest-mock-extended');
const mockPrisma = require('../database/prismaClient');
const taskController = require('../app/task/task.controller');
const { compact } = require('lodash');



describe('Task Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      user: {
        id: 1,
        organizationId: 1
      },

    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };

    mockReset(mockPrisma);
  });

  describe('create', () => {
    const mockCreatedTask = {
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      organizationId: 1,
      userId: 1
    };

      it('should create a task successfully', async () => {
        
        req.body = {
            title: 'Test Task',
            description: 'Test Description'
        };
        mockPrisma.task.create.mockResolvedValue(mockCreatedTask);

        await taskController.create(req, res);

        expect(mockPrisma.task.create).toHaveBeenCalledWith({
            data: {
            title: 'Test Task',
            description: 'Test Description',
            organizationId: 1,
            userId: 1
            }
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockCreatedTask);
    });

    it('should handle validation error', async () => {
      req.body = { title: '' }; // Invalid data

      await taskController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'description is a required field' });
    });
  });

  describe('update', () => {
    const mockUpdatedTask = {
      id: 1,
      title: 'Updated Task',
      description: 'Updated Description',
      completed: true,
      organizationId: 1,
      userId: 1
    };

    beforeEach(() => {
      req.params = { id: '1' };
      req.body = {
        title: 'Updated Task',
        description: 'Updated Description',
        completed: true
      };
    });

    it('should update a task successfully', async () => {
      mockPrisma.task.update.mockResolvedValue(mockUpdatedTask);

      await taskController.update(req, res);

      expect(mockPrisma.task.update).toHaveBeenCalledWith({
        where: { id: 1, organizationId: 1 },
        data: {
          title: 'Updated Task',
          description: 'Updated Description',
          completed: true
        }
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedTask);
    });
      
      it('should handle validation error', async () => { 
        req.body = {}; // Invalid data

        await taskController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(
         {error:'At least one field must be provided'}
        );
      });
      
  });

  describe('getAll', () => {
    const mockTasks = [
      {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        completed: false,
        comments: []
      }
    ];

    it('should get all tasks successfully', async () => {
      mockPrisma.task.findMany.mockResolvedValue(mockTasks);

      await taskController.getAll(req, res);

      expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
        where: { organizationId: 1 },
        include: { comments: true }
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTasks);
    });

    it('should handle error when getting tasks', async () => {
      mockPrisma.task.findMany.mockRejectedValue(new Error('Database error'));

      await taskController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to retrieve tasks' });
    });
  });

  describe('get', () => {
    const mockTask = {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      completed: false,
      comments: []
    };

    beforeEach(() => {
      req.params = { id: '1' };
    });

    it('should get a task successfully', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(mockTask);

      await taskController.get(req, res);

      expect(mockPrisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: 1, organizationId: 1 },
        include: { comments: true }
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    it('should handle task not found', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(null);

      await taskController.get(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Task not found' });
    });
      
      it('should handle error when getting task', async () => { 
        mockPrisma.task.findUnique.mockRejectedValue(new Error('Database error'));

        await taskController.get(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to retrieve task' });
      });
  });

  describe('remove', () => {
    beforeEach(() => {
      req.params = { id: '1' };
    });

    it('should delete a task successfully', async () => {
      mockPrisma.task.delete.mockResolvedValue({});

      await taskController.remove(req, res);

      expect(mockPrisma.task.delete).toHaveBeenCalledWith({
        where: { id: 1, organizationId: 1 }
      });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle error when deleting task', async () => {
      mockPrisma.task.delete.mockRejectedValue(new Error('Delete failed'));

      await taskController.remove(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to delete task' });
    });
  });
});