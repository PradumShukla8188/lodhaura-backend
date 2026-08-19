const { body, param, validationResult } = require('express-validator');

function validator(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
}

module.exports = {
    idValidator: [param('id').isMongoId().withMessage('Valid id is required'), validator],
    createSchemeValidator: [
        body('title').notEmpty().withMessage('Title is required'),
        body('description').notEmpty().withMessage('Description is required'),
        validator,
    ],
};
