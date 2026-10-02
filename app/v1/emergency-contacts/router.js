const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { checkPermission } = require('../../../middleware/checkPermission');

router.get('/', controller.getAllEmergencyContacts);

// Admin routes
router.post('/', verifyTokenMiddleware, checkPermission('Village Directory', 'Add'), controller.createEmergencyContact);
router.put('/:id', verifyTokenMiddleware, checkPermission('Village Directory', 'Edit'), controller.updateEmergencyContact);
router.delete('/:id', verifyTokenMiddleware, checkPermission('Village Directory', 'Delete'), controller.deleteEmergencyContact);

module.exports = router;
