const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { idValidator, createNewsValidator } = require('./validator');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { isAdmin } = require('../../../middleware/isAdmin');

router.get('/', controller.getAllNews);
router.get('/:id', idValidator, controller.getNewsById);
router.post('/', verifyTokenMiddleware, createNewsValidator, controller.createNews);
router.patch('/:id', verifyTokenMiddleware, idValidator, controller.updateNews);
router.delete('/:id', verifyTokenMiddleware, isAdmin, idValidator, controller.deleteNews);

module.exports = router;
