const express = require('express');
const router = express.Router();
const controller = require('./controller');
// const { verifyToken } = require('../../../middleware/auth');

router.post('/', controller.submitInquiry);
router.get('/', controller.getAllInquiries); // Can add verifyToken later if needed for admin

module.exports = router;
