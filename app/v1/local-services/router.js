const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { checkPermission } = require('../../../middleware/checkPermission');

// Public route to get approved services
router.get('/', controller.getAllLocalServices);

// Open to anyone (maybe with optional token if logged in)
const extractTokenOptional = (req, res, next) => {
    // If token exists, parse it, else next()
    const token = req.headers['authorization'];
    if (token) {
        verifyTokenMiddleware(req, res, next);
    } else {
        next();
    }
};

router.post('/', extractTokenOptional, controller.registerLocalService);

// Admin route
router.get('/admin', verifyTokenMiddleware, checkPermission('Local Services', 'view'), controller.getAdminLocalServices);
router.patch('/admin/:id/status', verifyTokenMiddleware, checkPermission('Local Services', 'approve'), controller.updateLocalServiceStatusAdmin);
router.delete('/admin/:id', verifyTokenMiddleware, checkPermission('Local Services', 'delete'), controller.deleteLocalServiceAdmin);

module.exports = router;
