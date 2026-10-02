const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { idValidator, createSchemeValidator } = require('./validator');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { isAdmin } = require('../../../middleware/isAdmin');
const { checkPermission } = require('../../../middleware/checkPermission');

router.get('/', controller.getAllSchemes);
router.get('/:id', idValidator, controller.getSchemeById);
router.post('/', verifyTokenMiddleware, checkPermission('Government Schemes', 'Create'), createSchemeValidator, controller.createScheme);
router.patch('/:id', verifyTokenMiddleware, checkPermission('Government Schemes', 'Edit'), idValidator, controller.updateScheme);
router.delete('/:id', verifyTokenMiddleware, checkPermission('Government Schemes', 'Delete'), idValidator, controller.deleteScheme);

module.exports = router;
