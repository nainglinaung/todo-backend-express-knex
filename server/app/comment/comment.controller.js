// FILE: comment.controller.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
  const { text, taskId } = req.body;
  try {
    const comment = await prisma.comment.create({
      data: {
        text,
        taskId,
        userId: req.user.id,
      },
    });
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  try {
    const comment = await prisma.comment.update({
      where: { id: parseInt(id), userId: req.user.id },
      data: {
        text,
      },
    });
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update comment' });
  }
};

const getAll = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { userId: req.user.id },
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve comments' });
  }
};

const get = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id), userId: req.user.id },
    });
    if (comment) {
      res.status(200).json(comment);
    } else {
      res.status(404).json({ error: 'Comment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve comment' });
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.comment.delete({
      where: { id: parseInt(id), userId: req.user.id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

module.exports = {
  create,
  update,
  getAll,
  get,
  remove,
};