const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');

router.use(verifyTokenMiddleware);

router.get('/profile', controller.getProfile);
router.put('/profile', controller.updateProfile);

router.get('/family', controller.getFamilyMembers);
router.post('/family', controller.addFamilyMember);

router.get('/documents', controller.getDocuments);
router.put('/documents', controller.updateDocumentStatus);

// Admin routes
const { checkPermission } = require('../../../middleware/checkPermission');
router.get('/admin', checkPermission('Residents', 'view'), controller.getAdminResidents);
router.delete('/admin/:id', checkPermission('Residents', 'delete'), controller.deleteResidentAdmin);

module.exports = router;
