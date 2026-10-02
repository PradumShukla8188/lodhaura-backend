const { body, param, query, validationResult } = require('express-validator');

function validator(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

module.exports = {
    registerValidator: [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
            .matches(/[A-Z]/)
            .withMessage('Include at least one uppercase letter')
            .matches(/[0-9]/)
            .withMessage('Include at least one number'),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),
        validator,
    ],
    registerResidentValidator: [
        body('name').notEmpty().withMessage('Name is required'),
        body('phone').notEmpty().withMessage('Mobile number is required'),
        body('email').optional().isEmail().withMessage('Valid email is required'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
            .matches(/[A-Z]/)
            .withMessage('Include at least one uppercase letter')
            .matches(/[0-9]/)
            .withMessage('Include at least one number'),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),
        body('houseNumber').notEmpty().withMessage('House number is required'),
        body('street').notEmpty().withMessage('Street/locality is required'),
        body('postOffice').notEmpty().withMessage('Post office is required'),
        body('district').notEmpty().withMessage('District is required'),
        body('state').notEmpty().withMessage('State is required'),
        body('pincode').notEmpty().withMessage('PIN code is required'),
        body('familyHeadName').notEmpty().withMessage('Family/household head name is required'),
        validator,
    ],
    loginValidator: [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required'),
        validator,
    ],
    refreshTokenValidator: [
        body('refreshToken').notEmpty().withMessage('Refresh token is required'),
        validator,
    ],
    forgotPasswordValidator: [
        body('email').isEmail().withMessage('Valid email is required'),
        validator,
    ],
    resetPasswordValidator: [
        body('token').notEmpty().withMessage('Reset token is required'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
            .matches(/[A-Z]/)
            .withMessage('Include at least one uppercase letter')
            .matches(/[0-9]/)
            .withMessage('Include at least one number'),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
        validator,
    ],
    idValidator: [
        param('id').isMongoId().withMessage('Valid id is required'),
        validator,
    ],
};
