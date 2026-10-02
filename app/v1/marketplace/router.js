const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');

router.get('/', controller.getAllMarketplaceItems);
router.post('/', verifyTokenMiddleware, controller.createMarketplaceItem);
router.patch('/:id/status', verifyTokenMiddleware, controller.updateMarketplaceItemStatus);
router.delete('/:id', verifyTokenMiddleware, controller.deleteMarketplaceItem);

// Admin routes
const { checkPermission } = require('../../../middleware/checkPermission');
router.get('/admin', verifyTokenMiddleware, checkPermission('Marketplace', 'view'), controller.getAdminMarketplaceItems);
router.patch('/admin/:id/status', verifyTokenMiddleware, checkPermission('Marketplace', 'approve'), controller.updateMarketplaceItemStatusAdmin);
router.delete('/admin/:id', verifyTokenMiddleware, checkPermission('Marketplace', 'delete'), controller.deleteMarketplaceItemAdmin);

module.exports = router;
