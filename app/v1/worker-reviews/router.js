const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');

router.get('/worker/:workerId', controller.getWorkerReviews);
router.post('/', verifyTokenMiddleware, controller.addReview);

module.exports = router;
