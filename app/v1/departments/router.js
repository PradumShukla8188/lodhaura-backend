const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { checkPermission } = require('../../../middleware/checkPermission');
const { isAdmin } = require('../../../middleware/isAdmin');

router.get('/', verifyTokenMiddleware, controller.getDepartments);
router.post('/', verifyTokenMiddleware, isAdmin, controller.createDepartment);
router.put('/:id', verifyTokenMiddleware, isAdmin, controller.updateDepartment);
router.delete('/:id', verifyTokenMiddleware, isAdmin, controller.deleteDepartment);

module.exports = router;
