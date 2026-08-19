const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { idValidator, createCommentValidator } = require('./validator');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');

router.get('/', controller.getComments);
router.post('/', verifyTokenMiddleware, createCommentValidator, controller.createComment);
router.delete('/:id', verifyTokenMiddleware, idValidator, controller.deleteComment);

module.exports = router;
