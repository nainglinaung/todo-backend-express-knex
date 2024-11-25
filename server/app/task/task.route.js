// FILE: task.route.js

const express = require('express');
const router = express.Router();
const taskController = require('./task.controller');
const authMiddleware = require('../../middleware/auth.middleware');

router.use(authMiddleware);

router.post('/', taskController.create);
router.put('/:id', taskController.update);
router.get('/', taskController.getAll);
router.get('/:id', taskController.get);
router.delete('/:id', taskController.remove);

module.exports = router;