const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { idValidator, createDonationValidator, createOrderValidator, verifyPaymentValidator } = require('./validator');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { checkPermission } = require('../../../middleware/checkPermission');

router.get('/razorpay-config', controller.getRazorpayConfig);
router.post('/create-order', createOrderValidator, controller.createRazorpayOrder);
router.post('/verify-payment', verifyPaymentValidator, controller.verifyRazorpayPayment);
router.post('/', createDonationValidator, controller.createDonation);
router.get('/', verifyTokenMiddleware, checkPermission('Funds', 'View'), controller.getAllDonations);
router.get('/:id', verifyTokenMiddleware, checkPermission('Funds', 'View'), idValidator, controller.getDonationById);
router.patch('/:id', verifyTokenMiddleware, checkPermission('Funds', 'Edit'), idValidator, controller.updateDonationStatus);

module.exports = router;
