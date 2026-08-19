const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { toggleLikeValidator } = require('./validator');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');

router.post('/toggle', verifyTokenMiddleware, toggleLikeValidator, controller.toggleLike);
router.get('/my', verifyTokenMiddleware, controller.getMyLikes);

module.exports = router;
