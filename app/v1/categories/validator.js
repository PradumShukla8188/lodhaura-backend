const { body, param, validationResult } = require('express-validator');

function validator(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

module.exports = {
    idValidator: [param('id').isMongoId().withMessage('Valid id is required'), validator],
    createCategoryValidator: [
        body('name').notEmpty().withMessage('Name is required'),
        body('type').optional().isIn(['blog', 'news', 'event', 'scheme', 'service', 'general']),
        validator,
    ],
    updateCategoryValidator: [
        param('id').isMongoId().withMessage('Valid id is required'),
        validator,
    ],
};
