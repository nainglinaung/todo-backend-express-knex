// FILE: task.controller.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../../database/prismaClient');
const {createUserSchema,loginSchema,updateSchema} = require('./user.schema')


const create = async (req, res) => {

  const { name, email, password } = req.body;
    
  try {
      const userData = await createUserSchema.validate({ name, email, password });
     
      userData.password = await bcrypt.hash(password, 10);
     
      const user = await prisma.user.create({
          data: userData,
      });
     
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
          expiresIn: '1h',
      });
     
      res.status(201).json({ token });
  } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: error.message });
  }
};


const login = async (req, res) => { 


  try {
    const { email, password } = req.body;
  

  const payload = await loginSchema.validate({ email, password });
  
    
    const user = await prisma.user.findUnique({
        where: { email:payload.email },
    });
    
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const valid = await bcrypt.compare(payload.password, user.password);
    
    if (!valid) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email, organizationId:user.organizationId }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
    
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
  
};



const update = async (req, res) => {
  const { id } = req.params;
  // const { name, email, password, organizationId } = req.body;
  
    const payload = await updateSchema.validate(req.body);
    
    payload.password = await bcrypt.hash(payload.password, 10);
    
    try {
      
        if (parseInt(id) !== req.user.id) { 
            return res.status(403).json({ error: 'Forbidden' });
        }

        const user = await prisma.user.update({
          where: { id: parseInt(id) },
          data: payload,
        });
        const token = jwt.sign({ id: user.id, email: user.email, organizationId:user.organizationId }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        return res.status(200).json({token});
    } catch (error) {
      console.error(error);
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
      res.status(404).json({ error: 'User not found' });
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
    res.status(204).json();
  } catch (error) {
    console.error(error);
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