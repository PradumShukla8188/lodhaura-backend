const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { idValidator, createCategoryValidator, updateCategoryValidator } = require('./validator');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { isAdmin } = require('../../../middleware/isAdmin');

router.get('/', controller.getAllCategories);
router.get('/:id', idValidator, controller.getCategoryById);
router.post('/', verifyTokenMiddleware, isAdmin, createCategoryValidator, controller.createCategory);
router.patch('/:id', verifyTokenMiddleware, isAdmin, updateCategoryValidator, controller.updateCategory);
router.delete('/:id', verifyTokenMiddleware, isAdmin, idValidator, controller.deleteCategory);

module.exports = router;
