const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');

router.use(verifyTokenMiddleware);

router.post('/', controller.createRequest);
router.get('/me', controller.getMyRequests);
router.get('/jobs', controller.getMyJobs);
router.patch('/:id/status', controller.updateRequestStatus);

module.exports = router;
