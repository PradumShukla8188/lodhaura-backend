const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { idValidator } = require('../onBoarding/validator');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { isAdmin } = require('../../../middleware/isAdmin');

router.post('/reports', verifyTokenMiddleware, controller.submitReport);

router.use(verifyTokenMiddleware, isAdmin);

router.get('/dashboard', controller.getDashboardStats);
router.get('/pending', controller.getPendingContent);
router.get('/users', controller.getAllUsersAdmin);
router.get('/content', controller.getAllContent);
router.patch('/users/:id/toggle-status', idValidator, controller.toggleUserStatus);
router.patch('/approve/:type/:id', controller.approveContent);
router.patch('/content/:type/:id/status', controller.updateContentStatus);
router.get('/reports', controller.getReports);
router.patch('/reports/:id', idValidator, controller.updateReportStatus);

module.exports = router;
