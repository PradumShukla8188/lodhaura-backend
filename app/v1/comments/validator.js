const { body, param, validationResult } = require('express-validator');

function validator(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
}

module.exports = {
    idValidator: [param('id').isMongoId().withMessage('Valid id is required'), validator],
    createCommentValidator: [
        body('targetType').isIn(['blog', 'news', 'event', 'video', 'image']).withMessage('Invalid target type'),
        body('targetId').isMongoId().withMessage('Valid target id is required'),
        body('content').notEmpty().withMessage('Content is required'),
        validator,
    ],
};
