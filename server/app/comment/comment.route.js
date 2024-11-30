// FILE: comment.route.js

const express = require('express');
const router = express.Router();
const commentController = require('./comment.controller');
const authMiddleware = require('../../middleware/auth.middleware');

router.use(authMiddleware);

router.post('/', commentController.create);
router.put('/:id', commentController.update);
router.get('/', commentController.getAll);
router.get('/:id', commentController.get);
router.delete('/:id', commentController.remove);

module.exports = router;