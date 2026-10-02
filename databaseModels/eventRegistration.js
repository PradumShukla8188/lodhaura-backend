const mongoose = require('mongoose');

const EventRegistrationSchema = new mongoose.Schema({
    eventId: { type: mongoose.Types.ObjectId, ref: 'Event', required: true },
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    
    referenceId: { type: String, unique: true, required: true },
    
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String },
    
    attendees: { type: Number, default: 1, min: 1 },
    note: { type: String },
    
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'], 
        default: 'Approved' // Assuming auto-approve for now unless fee is required
    },
    
    attendance: {
        type: String,
        enum: ['Registered', 'Checked In', 'Attended', 'Absent'],
        default: 'Registered'
    },
    
    // For paid events (mocked)
    paymentStatus: {
        type: String,
        enum: ['N/A', 'Pending', 'Paid', 'Failed'],
        default: 'N/A'
    }
}, { timestamps: true });

// Prevent duplicate registrations
EventRegistrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = { EventRegistrationModel: mongoose.model('EventRegistration', EventRegistrationSchema) };
