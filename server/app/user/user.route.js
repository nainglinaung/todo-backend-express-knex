// FILE: task.route.js

const express = require('express');
const router = express.Router();
const userController = require('./user.controller');

router.post('/', userController.create);
router.post('/login', userController.login);
router.put('/:id', userController.update);
router.get('/', userController.getAll);
router.get('/:id', userController.get);
router.delete('/:id', userController.remove);

module.exports = router;