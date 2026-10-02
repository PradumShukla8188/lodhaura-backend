const mongoose = require('mongoose');

const WorkerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    skills: [{
        type: String,
    }],
    experience: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    address: {
        type: String,
        required: true,
    },
    serviceAreaRadius: {
        type: Number,
        default: 10,
    },
    pricePerDay: {
        type: Number,
        required: true,
    },
    pricePerHour: {
        type: Number,
        default: null,
    },
    availabilityStatus: {
        type: Boolean,
        default: true,
    },
    availableDays: [{
        type: String,
    }],
    isVerified: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    totalReviews: {
        type: Number,
        default: 0,
    },
    totalJobsCompleted: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

module.exports = { WorkerModel: mongoose.model('Worker', WorkerSchema) };
