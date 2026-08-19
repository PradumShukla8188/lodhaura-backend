const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { updateProfileValidator, changePasswordValidator } = require('./validator');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');

router.use(verifyTokenMiddleware);

router.get('/me', controller.getMyProfile);
router.patch('/me', updateProfileValidator, controller.updateMyProfile);
router.post('/change-password', changePasswordValidator, controller.changePassword);

module.exports = router;
