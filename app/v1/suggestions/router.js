const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/', controller.submitSuggestion);
router.get('/', controller.getAllSuggestions);

module.exports = router;
