const { body, param, validationResult } = require('express-validator');

function validator(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
}

module.exports = {
    idValidator: [param('id').isMongoId().withMessage('Valid id is required'), validator],
    createDonationValidator: [
        body('donorName').notEmpty().withMessage('Donor name is required'),
        body('amount').isNumeric().withMessage('Valid amount is required'),
        validator,
    ],
    createOrderValidator: [
        body('donorName').notEmpty().withMessage('Donor name is required'),
        body('amount').isFloat({ min: 1 }).withMessage('Minimum amount is ₹1'),
        body('email').optional().isEmail(),
        body('phone').optional().trim(),
        body('purpose').optional().trim(),
        validator,
    ],
    verifyPaymentValidator: [
        body('razorpay_order_id').notEmpty(),
        body('razorpay_payment_id').notEmpty(),
        body('razorpay_signature').notEmpty(),
        body('donationId').notEmpty(),
        validator,
    ],
};
