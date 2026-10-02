const mongoose = require('mongoose');

const WorkerReviewSchema = new mongoose.Schema({
    requestId: {
        type: mongoose.Types.ObjectId,
        ref: 'WorkerRequest',
        required: true,
        unique: true,
    },
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
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    review: {
        type: String,
        default: '',
    },
}, { timestamps: true });

module.exports = { WorkerReviewModel: mongoose.model('WorkerReview', WorkerReviewSchema) };
