const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { idValidator, submitContactValidator } = require('./validator');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { isAdmin } = require('../../../middleware/isAdmin');

router.post('/', submitContactValidator, controller.submitContact);
router.get('/', verifyTokenMiddleware, isAdmin, controller.getAllContacts);
router.patch('/:id', verifyTokenMiddleware, isAdmin, idValidator, controller.updateContactStatus);

module.exports = router;
