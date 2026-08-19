const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { idValidator } = require('../onBoarding/validator');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { upload } = require('../../../middleware/upload');

router.get('/', controller.getAllVideos);
router.get('/:id', idValidator, controller.getVideoById);
router.post('/', verifyTokenMiddleware, upload.single('video'), controller.uploadVideo);
router.delete('/:id', verifyTokenMiddleware, idValidator, controller.deleteVideo);

module.exports = router;
