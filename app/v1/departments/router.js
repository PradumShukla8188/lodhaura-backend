const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { checkPermission } = require('../../../middleware/checkPermission');
const { isAdmin } = require('../../../middleware/isAdmin');

router.get('/', verifyTokenMiddleware, controller.getDepartments);
router.post('/', verifyTokenMiddleware, checkPermission('Departments', 'Create'), controller.createDepartment);
router.put('/:id', verifyTokenMiddleware, checkPermission('Departments', 'Edit'), controller.updateDepartment);
router.delete('/:id', verifyTokenMiddleware, checkPermission('Departments', 'Delete'), controller.deleteDepartment);

module.exports = router;
