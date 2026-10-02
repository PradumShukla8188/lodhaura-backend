const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { isAdmin } = require('../../../middleware/isAdmin');

router.get('/', verifyTokenMiddleware, controller.getRoles);
router.post('/', verifyTokenMiddleware, isAdmin, controller.createRole);
router.put('/:id', verifyTokenMiddleware, isAdmin, controller.updateRole);
router.delete('/:id', verifyTokenMiddleware, isAdmin, controller.deleteRole);

module.exports = router;
