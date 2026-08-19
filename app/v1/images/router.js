const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { idValidator } = require('../onBoarding/validator');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { upload } = require('../../../middleware/upload');

router.get('/', controller.getAllImages);
router.get('/:id', idValidator, controller.getImageById);
router.post('/', verifyTokenMiddleware, upload.single('image'), controller.uploadImage);
router.delete('/:id', verifyTokenMiddleware, idValidator, controller.deleteImage);

module.exports = router;
