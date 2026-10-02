const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { checkPermission } = require('../../../middleware/checkPermission');

router.get('/', verifyTokenMiddleware, checkPermission('Panchayat Meetings', 'View'), controller.getAllMeetings);
router.post('/', verifyTokenMiddleware, checkPermission('Panchayat Meetings', 'Create'), controller.createMeeting);
router.put('/:id', verifyTokenMiddleware, checkPermission('Panchayat Meetings', 'Edit'), controller.updateMeeting);
router.delete('/:id', verifyTokenMiddleware, checkPermission('Panchayat Meetings', 'Delete'), controller.deleteMeeting);

module.exports = router;
