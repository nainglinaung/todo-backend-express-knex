const {  mockReset } = require('jest-mock-extended');
const mockPrisma = require('../database/prismaClient');
const commentController = require('../app/comment/comment.controller');


describe('Comment Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      user: {
        id: 1
        },
        body: {
            text: 'Test Comment',
            taskId: 1
        }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };

    mockReset(mockPrisma);
  });

  describe('create', () => {
    const mockCreatedComment = {
      id: 1,
      text: 'Test Comment',
      taskId: 1,
      userId: 1
    };
      
    it('should create a comment successfully', async () => {
      mockPrisma.comment.create.mockResolvedValue(mockCreatedComment);

      await commentController.create(req, res);

      expect(mockPrisma.comment.create).toHaveBeenCalledWith({
        data: {
          text: 'Test Comment',
          taskId: 1,
          userId: 1
        }
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCreatedComment);
    });

    it('should handle validation error', async () => {
      req.body = { text: '' }; // Invalid data

    
      await commentController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String)
        })
      );
    });
  });

  describe('update', () => {
    const mockUpdatedComment = {
      id: 1,
      text: 'Updated Comment',
      taskId: 2,
      userId: 1
    };

    beforeEach(() => {
      req.params = { id: '1' };
      req.body = {
        text: 'Updated Comment',
        taskId: 2
      };
    });

    it('should update a comment successfully', async () => {
      mockPrisma.comment.update.mockResolvedValue(mockUpdatedComment);

      await commentController.update(req, res);

      expect(mockPrisma.comment.update).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
        data: {
          text: 'Updated Comment',
          taskId: 2
        }
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedComment);
    });

    it('should handle validation error', async () => {
      req.body = {};

      await commentController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        {error:'At least one field must be provided'}
       );
    });
  });

  describe('getAll', () => {
    const mockComments = [
      {
        id: 1,
        text: 'Comment 1',
        taskId: 1,
        userId: 1
      }
    ];

    it('should get all comments successfully', async () => {
      mockPrisma.comment.findMany.mockResolvedValue(mockComments);

      await commentController.getAll(req, res);

      expect(mockPrisma.comment.findMany).toHaveBeenCalledWith({
        where: { userId: 1 }
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockComments);
    });

    it('should handle error when getting comments', async () => {
      mockPrisma.comment.findMany.mockRejectedValue(new Error('Database error'));

      await commentController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to retrieve comments' });
    });
  });

  describe('get', () => {
    const mockComment = {
      id: 1,
      text: 'Test Comment',
      taskId: 1,
      userId: 1
    };

    beforeEach(() => {
      req.params = { id: '1' };
    });

    it('should get a comment successfully', async () => {
      mockPrisma.comment.findUnique.mockResolvedValue(mockComment);

      await commentController.get(req, res);

      expect(mockPrisma.comment.findUnique).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 }
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockComment);
    });

    it('should handle comment not found', async () => {
      mockPrisma.comment.findUnique.mockResolvedValue(null);

      await commentController.get(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Comment not found' });
    });

    it('should handle error when getting comment', async () => {
      mockPrisma.comment.findUnique.mockRejectedValue(new Error('Database error'));

      await commentController.get(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to retrieve comment' });
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      req.params = { id: '1' };
    });

    it('should delete a comment successfully', async () => {
      mockPrisma.comment.delete.mockResolvedValue({});

      await commentController.remove(req, res);

      expect(mockPrisma.comment.delete).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 }
      });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle error when deleting comment', async () => {
      mockPrisma.comment.delete.mockRejectedValue(new Error('Delete failed'));

      await commentController.remove(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to delete comment' });
    });
  });
});