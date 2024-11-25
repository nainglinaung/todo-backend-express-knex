// FILE: task.controller.js
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();


const create = async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
      
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
          name, email, password:hashedPassword
      },
    });
        
        
    const token = jwt.sign({ id: user.id, email:user.email }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });    
        
        
    res.status(201).json({token});
    } catch (error) {
        console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};


const login = async (req, res) => { 
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({
        where: { email },
    });
    
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const valid = await bcrypt.compare(password, user.password);
    
    if (!valid) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email, organizationId:user.organizationId }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
    
    res.status(200).json({ token });
};



const update = async (req, res) => {
  const { id } = req.params;
    const { name, email, password,organizationId } = req.body;
    
    if (password) {
        password = await bcrypt.hash(password, 10);
    }

    try {
      
        if (parseInt(id) !== req.user.id) { 
            return res.status(403).json({ error: 'Forbidden' });
        }

        const user = await prisma.user.update({
        where: { id: parseInt(id) },
        data: {
            name,
            email,
            password,
            organizationId
        },
        });
        return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

const getAll = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

const get = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports = {
  create,
  update,
  getAll,
  get,
    remove,
    login,
};