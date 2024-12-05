const prisma = require('../../database/prismaClient')
const { createTaskSchema, updateTaskSchema } = require('./task.schema');


const create = async (req, res) => {
 
    try {
      
    const { title, description } = await createTaskSchema.validate(req.body);
 
    const task = await prisma.task.create({
      data: {
        title,
        description,
        organizationId: req.user.organizationId,
        userId: req.user.id,
      },
    });
    res.status(201).json(task);
  } catch (error) {
      console.error(error)
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
    try {
    
    const payload = await updateTaskSchema.validate(req.body);

    const task = await prisma.task.update({
      where: { id: parseInt(id), organizationId:req.user.organizationId },
      data: payload,
    });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const tasks = await (await prisma.task.findMany({
      where: { organizationId: req.user.organizationId },
      include: { comments: true },
    }))
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tasks' });
  }
};

const get = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.findUnique({
      where: { id: parseInt(id), organizationId: req.user.organizationId },
      include: { comments: true },
    });
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve task' });
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({
      where: { id: parseInt(id), organizationId:req.user.organizationId },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

module.exports = {
  create,
  update,
  getAll,
  get,
  remove,
};