const express = require('express');
const router = express.Router();
const controller = require('./controller');

const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { checkPermission } = require('../../../middleware/checkPermission');

router.post('/', controller.submitComplaint);
router.get('/my-complaints', verifyTokenMiddleware, controller.getMyComplaints);
router.get('/', verifyTokenMiddleware, checkPermission('Complaints & Issues', 'View'), controller.getAllComplaints);
router.put('/:id', verifyTokenMiddleware, checkPermission('Complaints & Issues', 'Edit'), controller.updateComplaint);

module.exports = router;
