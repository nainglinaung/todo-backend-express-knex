

const express = require('express');
const router = express.Router();
const projectController = require('./project.controller');
const authMiddleware = require('../../middleware/auth.middleware');

router.use(authMiddleware);

router.post('/', projectController.create);
router.put('/:id', projectController.update);
router.get('/', projectController.getAll);
router.get('/:id', projectController.get);
router.delete('/:id', projectController.remove);

module.exports = router;