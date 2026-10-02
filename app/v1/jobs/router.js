const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');

router.get('/', controller.getAllJobs);
router.post('/', verifyTokenMiddleware, controller.createJob);
router.patch('/:id/status', verifyTokenMiddleware, controller.updateJobStatus);
router.delete('/:id', verifyTokenMiddleware, controller.deleteJob);

// Admin routes
const { checkPermission } = require('../../../middleware/checkPermission');
router.get('/admin', verifyTokenMiddleware, checkPermission('Jobs', 'view'), controller.getAdminJobs);
router.patch('/admin/:id/status', verifyTokenMiddleware, checkPermission('Jobs', 'approve'), controller.updateJobStatusAdmin);
router.delete('/admin/:id', verifyTokenMiddleware, checkPermission('Jobs', 'delete'), controller.deleteJobAdmin);

module.exports = router;
