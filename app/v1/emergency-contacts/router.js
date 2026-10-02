const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { checkPermission } = require('../../../middleware/checkPermission');

router.get('/', controller.getAllEmergencyContacts);

// Admin routes
router.get('/admin', verifyTokenMiddleware, checkPermission('Emergency Contacts', 'view'), controller.getAdminEmergencyContacts);
router.post('/', verifyTokenMiddleware, checkPermission('Emergency Contacts', 'create'), controller.createEmergencyContact);
router.put('/:id', verifyTokenMiddleware, checkPermission('Emergency Contacts', 'edit'), controller.updateEmergencyContact);
router.delete('/:id', verifyTokenMiddleware, checkPermission('Emergency Contacts', 'delete'), controller.deleteEmergencyContact);

module.exports = router;
