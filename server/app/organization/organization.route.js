// FILE: organization.route.js

const express = require('express');
const router = express.Router();
const organizationController = require('./organization.controller');
const authMiddleware = require('../../middleware/auth.middleware');

router.use(authMiddleware);

router.post('/', organizationController.create);
router.put('/:id', organizationController.update);
router.get('/', organizationController.getAll);
router.get('/:id', organizationController.get);
router.delete('/:id', organizationController.remove);

module.exports = router;