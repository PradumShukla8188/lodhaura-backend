const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { checkPermission } = require('../../../middleware/checkPermission');

router.get('/', verifyTokenMiddleware, checkPermission('Audit Logs', 'View'), controller.getAuditLogs);

module.exports = router;
