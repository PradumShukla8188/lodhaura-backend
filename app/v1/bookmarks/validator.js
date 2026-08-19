const { body, validationResult } = require('express-validator');

function validator(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
}

module.exports = {
    toggleBookmarkValidator: [
        body('targetType').isIn(['blog', 'news', 'event', 'video', 'scheme']).withMessage('Invalid target type'),
        body('targetId').isMongoId().withMessage('Valid target id is required'),
        validator,
    ],
};
