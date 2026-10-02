const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { checkPermission } = require('../../../middleware/checkPermission');

router.get('/', verifyTokenMiddleware, checkPermission('roles', 'view'), controller.getRoles);
router.post('/', verifyTokenMiddleware, checkPermission('roles', 'create'), controller.createRole);
router.put('/:id', verifyTokenMiddleware, checkPermission('roles', 'edit'), controller.updateRole);
router.delete('/:id', verifyTokenMiddleware, checkPermission('roles', 'delete'), controller.deleteRole);

module.exports = router;
