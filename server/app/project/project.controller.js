// FILE: project.controller.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
    const { name, description } = req.body;
    
    console.log(req.user);
  try {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        organizationId: req.user.organizationId,
        userId: req.user.id,
      },
    });
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const project = await prisma.project.update({
      where: { id: parseInt(id), organizationId: req.user.organizationId },
      data: {
        name,
        description,
      },
    });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
};

const getAll = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { organizationId: req.user.organizationId },
    });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve projects' });
  }
};

const get = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id), organizationId: req.user.organizationId },
    });
    if (project) {
      res.status(200).json(project);
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve project' });
  }
};

const remove = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
  try {
    await prisma.project.delete({
      where: { id: parseInt(id), organizationId: req.user.organizationId, userId },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

module.exports = {
  create,
  update,
  getAll,
  get,
  remove,
};

// FILE: project.route.js