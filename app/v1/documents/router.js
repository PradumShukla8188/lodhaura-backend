const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { checkPermission } = require('../../../middleware/checkPermission');

router.get('/', verifyTokenMiddleware, checkPermission('Documents', 'View'), controller.getDocuments);
router.post('/', verifyTokenMiddleware, checkPermission('Documents', 'Upload'), controller.createDocument);
router.put('/:id', verifyTokenMiddleware, checkPermission('Documents', 'Edit'), controller.updateDocument);
router.delete('/:id', verifyTokenMiddleware, checkPermission('Documents', 'Delete'), controller.deleteDocument);

module.exports = router;
