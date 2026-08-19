const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { idValidator, createEventValidator } = require('./validator');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { isAdmin } = require('../../../middleware/isAdmin');

router.get('/', controller.getAllEvents);
router.get('/:id', idValidator, controller.getEventById);
router.post('/', verifyTokenMiddleware, createEventValidator, controller.createEvent);
router.patch('/:id', verifyTokenMiddleware, idValidator, controller.updateEvent);
router.delete('/:id', verifyTokenMiddleware, isAdmin, idValidator, controller.deleteEvent);

module.exports = router;
