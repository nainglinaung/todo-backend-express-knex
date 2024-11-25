// FILE: organization.controller.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
  const { name, description } = req.body;
  try {
    const organization = await prisma.organization.create({
      data: {
        name,
        description,
      },
    });
    res.status(201).json(organization);
  } catch (error) {
      console.error(error);
    res.status(500).json({ error: 'Failed to create organization' });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const organization = await prisma.organization.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
      },
    });
    res.status(200).json(organization);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update organization' });
  }
};

const getAll = async (req, res) => {
  try {
      const organizations = await prisma.organization.findMany();
    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve organizations' });
  }
};

const get = async (req, res) => {
  const { id } = req.params;
  try {
    const organization = await prisma.organization.findUnique({
      where: { id: parseInt(id) },
    });
    if (organization) {
      res.status(200).json(organization);
    } else {
      res.status(404).json({ error: 'Organization not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve organization' });
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.organization.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete organization' });
  }
};

module.exports = {
  create,
  update,
  getAll,
  get,
  remove,
};