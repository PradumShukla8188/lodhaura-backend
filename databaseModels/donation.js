const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    donorName: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    purpose: { type: String, default: 'General' },
    message: { type: String, default: '' },
    paymentMethod: { type: String, default: 'offline' },
    transactionId: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = { DonationModel: mongoose.model('Donation', DonationSchema) };
