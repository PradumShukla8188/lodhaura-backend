const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');

router.get('/', controller.getAllJobs);
router.post('/', verifyTokenMiddleware, controller.createJob);
router.patch('/:id/status', verifyTokenMiddleware, controller.updateJobStatus);
router.delete('/:id', verifyTokenMiddleware, controller.deleteJob);

module.exports = router;
