const express = require('express');
const router = express.Router();
const controller = require('./controller');
const {
    registerValidator,
    loginValidator,
    refreshTokenValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
} = require('./validator');

router.post('/register', registerValidator, controller.register);
router.post('/register-resident', require('./validator').registerResidentValidator, controller.registerResident);
router.post('/login', loginValidator, controller.login);
router.post('/refresh-token', refreshTokenValidator, controller.refreshToken);
router.post('/forgot-password', forgotPasswordValidator, controller.forgotPassword);
router.post('/reset-password', resetPasswordValidator, controller.resetPassword);

module.exports = router;
