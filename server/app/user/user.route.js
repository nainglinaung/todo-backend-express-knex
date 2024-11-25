// FILE: task.route.js

const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const authMiddleware = require('../../middleware/auth.middleware');


router.post('/', userController.create);
router.post('/login', userController.login);
router.put('/:id',authMiddleware, userController.update);
router.get('/',authMiddleware, userController.getAll);
router.get('/:id',authMiddleware, userController.get);
router.delete('/:id',authMiddleware, userController.remove);

module.exports = router;