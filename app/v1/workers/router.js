const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');

// Public routes
router.get('/', controller.getAllWorkers);
router.get('/:id', controller.getWorkerById);

// Protected routes (for worker)
router.use(verifyTokenMiddleware);
router.post('/register', controller.registerWorker);
router.get('/profile/me', controller.getMyProfile);
router.patch('/profile/me', controller.updateProfile);

// Admin routes
const { checkPermission } = require('../../../middleware/checkPermission');
router.get('/admin', checkPermission('Workers', 'view'), controller.getAdminWorkers);
router.patch('/admin/:id/verify', checkPermission('Workers', 'approve'), controller.verifyWorker);
router.delete('/admin/:id', checkPermission('Workers', 'delete'), controller.deleteWorker);

module.exports = router;
