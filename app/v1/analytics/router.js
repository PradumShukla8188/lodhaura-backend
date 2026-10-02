const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');

// All endpoints accessible by admins and users who can view analytics
router.get('/', verifyTokenMiddleware, controller.getDashboardStats);
router.get('/export/projects', verifyTokenMiddleware, controller.exportProjects);
router.get('/export/transactions', verifyTokenMiddleware, controller.exportTransactions);
router.get('/export/complaints', verifyTokenMiddleware, controller.exportComplaints);

module.exports = router;
