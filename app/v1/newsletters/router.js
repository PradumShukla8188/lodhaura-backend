const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/subscribe', controller.subscribe);
router.get('/', controller.getAllSubscribers);

module.exports = router;
