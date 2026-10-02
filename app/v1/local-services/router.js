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
router.patch('/:id/status', verifyTokenMiddleware, checkPermission('Village Directory', 'Edit'), controller.updateLocalServiceStatus);

module.exports = router;
