const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { checkPermission } = require('../../../middleware/checkPermission');

// Public route to get approved services
router.get('/', controller.getAllAgricultureServices);

const extractTokenOptional = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token) {
        verifyTokenMiddleware(req, res, next);
    } else {
        next();
    }
};

router.post('/', extractTokenOptional, controller.registerAgricultureService);

// Admin route
router.patch('/:id/status', verifyTokenMiddleware, checkPermission('Village Directory', 'Edit'), controller.updateAgricultureServiceStatus);

module.exports = router;
