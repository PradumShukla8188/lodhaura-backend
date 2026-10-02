const mongoose = require('mongoose');

const WorkerRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    workerId: {
        type: mongoose.Types.ObjectId,
        ref: 'Worker',
        required: true,
    },
    service: {
        type: String,
        required: true,
    },
    requiredDate: {
        type: Date,
        required: true,
    },
    numberOfDays: {
        type: Number,
        default: 1,
    },
    notes: {
        type: String,
        default: '',
    },
    estimatedTotal: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Pending',
    },
}, { timestamps: true });

module.exports = { WorkerRequestModel: mongoose.model('WorkerRequest', WorkerRequestSchema) };
