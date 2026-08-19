const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { idValidator, createSchemeValidator } = require('./validator');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { isAdmin } = require('../../../middleware/isAdmin');

router.get('/', controller.getAllSchemes);
router.get('/:id', idValidator, controller.getSchemeById);
router.post('/', verifyTokenMiddleware, isAdmin, createSchemeValidator, controller.createScheme);
router.patch('/:id', verifyTokenMiddleware, isAdmin, idValidator, controller.updateScheme);
router.delete('/:id', verifyTokenMiddleware, isAdmin, idValidator, controller.deleteScheme);

module.exports = router;
