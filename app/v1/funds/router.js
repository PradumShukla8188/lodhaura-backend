const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { checkPermission } = require('../../../middleware/checkPermission');

router.get('/', verifyTokenMiddleware, checkPermission('Funds', 'View'), controller.getTransactions);
router.get('/project/:id', verifyTokenMiddleware, checkPermission('Funds', 'View'), controller.getProjectTransactions);
router.post('/', verifyTokenMiddleware, checkPermission('Funds', 'Create'), controller.createTransaction);

module.exports = router;
