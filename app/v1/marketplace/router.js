const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');

router.get('/', controller.getAllMarketplaceItems);
router.post('/', verifyTokenMiddleware, controller.createMarketplaceItem);
router.patch('/:id/status', verifyTokenMiddleware, controller.updateMarketplaceItemStatus);
router.delete('/:id', verifyTokenMiddleware, controller.deleteMarketplaceItem);

module.exports = router;
