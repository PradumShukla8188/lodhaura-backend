const Razorpay = require('razorpay');
const crypto = require('crypto');
const { config } = require('../config');

let instance = null;

const getRazorpay = () => {
    const keyId = process.env.RAZORPAY_KEY_ID || '';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
    if (!keyId || !keySecret) return null;
    if (!instance) {
        instance = new Razorpay({ key_id: keyId, key_secret: keySecret });
    }
    return instance;
};

module.exports = {
    isConfigured: () => Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),

    createOrder: async (amountInPaise, receipt, notes = {}) => {
        const razorpay = getRazorpay();
        if (!razorpay) {
            throw new Error('Razorpay is not configured.');
        }
        return razorpay.orders.create({
            amount: amountInPaise,
            currency: 'INR',
            receipt,
            notes,
        });
    },

    verifyPaymentSignature: ({ orderId, paymentId, signature }) => {
        const secret = process.env.RAZORPAY_KEY_SECRET || '';
        const body = `${orderId}|${paymentId}`;
        const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
        return expected === signature;
    },
};
