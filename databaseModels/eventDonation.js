const mongoose = require('mongoose');

const EventDonationSchema = new mongoose.Schema({
    eventId: { type: mongoose.Types.ObjectId, ref: 'Event', required: true },
    userId: { type: mongoose.Types.ObjectId, ref: 'User' }, // Optional for guests if enabled later
    
    donorName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String },
    
    amount: { type: Number, required: true, min: 1 },
    isAnonymous: { type: Boolean, default: false },
    message: { type: String },
    
    transactionId: { type: String, unique: true, required: true },
    paymentMethod: { type: String, default: 'Gateway' },
    
    status: { 
        type: String, 
        enum: ['Pending', 'Processing', 'Successful', 'Failed', 'Refunded', 'Cancelled'], 
        default: 'Successful' // Mocked as successful
    }
}, { timestamps: true });

module.exports = { EventDonationModel: mongoose.model('EventDonation', EventDonationSchema) };
