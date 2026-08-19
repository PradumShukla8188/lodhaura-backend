const { body, param, validationResult } = require('express-validator');

function validator(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
}

module.exports = {
    idValidator: [param('id').isMongoId().withMessage('Valid id is required'), validator],
    submitContactValidator: [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('subject').notEmpty().withMessage('Subject is required'),
        body('message').notEmpty().withMessage('Message is required'),
        validator,
    ],
};
