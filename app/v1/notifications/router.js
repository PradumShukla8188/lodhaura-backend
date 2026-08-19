const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { idValidator } = require('../onBoarding/validator');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { isAdmin } = require('../../../middleware/isAdmin');

router.get('/', verifyTokenMiddleware, controller.getMyNotifications);
router.patch('/read-all', verifyTokenMiddleware, controller.markAllAsRead);
router.patch('/:id/read', verifyTokenMiddleware, idValidator, controller.markAsRead);
router.post('/', verifyTokenMiddleware, isAdmin, controller.createNotification);

module.exports = router;
