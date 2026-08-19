const { DonationModel } = require('../../../databaseModels/donation');
const { createOrder, verifyPaymentSignature, isConfigured } = require('../../../helper/razorpay');

module.exports = {
    getRazorpayConfig: async (req, res) => {
        return res.status(200).send({
            message: 'Razorpay config fetched.',
            data: {
                enabled: isConfigured(),
                keyId: process.env.RAZORPAY_KEY_ID || '',
            },
        });
    },

    createRazorpayOrder: async (req, res) => {
        try {
            if (!isConfigured()) {
                return res.status(503).send({ message: 'Razorpay is not configured on server.' });
            }
            const { amount, donorName, email, phone, purpose } = req.body;
            const amountPaise = Math.round(Number(amount) * 100);
            if (amountPaise < 100) {
                return res.status(400).send({ message: 'Minimum donation is ₹1.' });
            }
            const receipt = `don_${Date.now()}`;
            const order = await createOrder(amountPaise, receipt, { donorName, purpose: purpose || 'General' });

            const donation = await DonationModel.create({
                userId: req.user?._id,
                donorName,
                email: email || '',
                phone: phone || '',
                amount: Number(amount),
                purpose: purpose || 'General',
                paymentMethod: 'razorpay',
                transactionId: order.id,
                status: 'pending',
            });

            return res.status(201).send({
                message: 'Order created successfully.',
                data: {
                    orderId: order.id,
                    amount: order.amount,
                    currency: order.currency,
                    donationId: donation._id,
                    keyId: process.env.RAZORPAY_KEY_ID,
                },
            });
        } catch (err) {
            console.log('createRazorpayOrder err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Failed to create payment order.' });
        }
    },

    verifyRazorpayPayment: async (req, res) => {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donationId } = req.body;
            const valid = verifyPaymentSignature({
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                signature: razorpay_signature,
            });
            if (!valid) {
                return res.status(400).send({ message: 'Payment verification failed.' });
            }
            const donation = await DonationModel.findById(donationId);
            if (!donation) return res.status(404).send({ message: 'Donation record not found.' });
            donation.status = 'completed';
            donation.transactionId = razorpay_payment_id;
            donation.paymentMethod = 'razorpay';
            await donation.save();
            return res.status(200).send({ message: 'Payment verified successfully.', data: donation });
        } catch (err) {
            console.log('verifyRazorpayPayment err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Payment verification error.' });
        }
    },

    getAllDonations: async (req, res) => {
        try {
            const donations = await DonationModel.find({ isDeleted: false })
                .populate('userId', 'name email')
                .sort({ createdAt: -1 });
            return res.status(200).send({ message: 'Donations fetched successfully.', data: donations });
        } catch (err) {
            console.log('getAllDonations err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    getDonationById: async (req, res) => {
        try {
            const donation = await DonationModel.findById(req.params.id).populate('userId', 'name email');
            if (!donation) return res.status(404).send({ message: 'Donation not found.' });
            return res.status(200).send({ message: 'Donation fetched successfully.', data: donation });
        } catch (err) {
            console.log('getDonationById err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    createDonation: async (req, res) => {
        try {
            const { donorName, email, phone, amount, purpose, message, paymentMethod, transactionId } = req.body;
            const donation = await DonationModel.create({
                userId: req.user?._id,
                donorName,
                email,
                phone,
                amount,
                purpose,
                message,
                paymentMethod,
                transactionId,
            });
            return res.status(201).send({ message: 'Donation recorded successfully.', data: donation });
        } catch (err) {
            console.log('createDonation err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    updateDonationStatus: async (req, res) => {
        try {
            const { status } = req.body;
            const donation = await DonationModel.findById(req.params.id);
            if (!donation) return res.status(404).send({ message: 'Donation not found.' });
            if (status) donation.status = status;
            await donation.save();
            return res.status(200).send({ message: 'Donation updated successfully.', data: donation });
        } catch (err) {
            console.log('updateDonationStatus err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },
};
