const { body, validationResult } = require('express-validator');

function validator(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const message = errors.array()[0]?.msg || 'Validation failed';
        return res.status(400).json({ message, errors: errors.array() });
    }
    next();
}

module.exports = {
    updateProfileValidator: [
        body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
        body('phone').optional().trim(),
        body('bio').optional().trim().isLength({ max: 500 }),
        body('avatar').optional().trim(),
        body('coverPhoto').optional().trim(),
        body('themePreference').optional().isIn(['light', 'dark', 'system']),
        validator,
    ],
    changePasswordValidator: [
        body('currentPassword').notEmpty().withMessage('Current password is required'),
        body('newPassword')
            .isLength({ min: 6 })
            .withMessage('New password must be at least 6 characters')
            .matches(/[A-Z]/)
            .withMessage('Include at least one uppercase letter')
            .matches(/[0-9]/)
            .withMessage('Include at least one number'),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
        validator,
    ],
};
