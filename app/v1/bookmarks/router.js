const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { toggleBookmarkValidator } = require('./validator');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');

router.post('/toggle', verifyTokenMiddleware, toggleBookmarkValidator, controller.toggleBookmark);
router.get('/my', verifyTokenMiddleware, controller.getMyBookmarks);

module.exports = router;
