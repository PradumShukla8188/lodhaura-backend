const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { isAdmin } = require('../../../middleware/isAdmin');
const { checkPermission } = require('../../../middleware/checkPermission');

// These routes require either Admin or explicit permission to manage users
router.get('/', verifyTokenMiddleware, isAdmin, controller.getGovUsers);
router.post('/', verifyTokenMiddleware, isAdmin, controller.createGovUser);
router.put('/:id', verifyTokenMiddleware, isAdmin, controller.updateGovUser);
router.delete('/:id', verifyTokenMiddleware, isAdmin, controller.deleteGovUser);

module.exports = router;
