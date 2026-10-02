const mongoose = require('mongoose');

const FundTransactionSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    transactionType: {
        type: String,
        enum: ['Fund Sanctioned', 'Fund Released', 'Fund Received', 'Payment', 'Expense', 'Adjustment'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    referenceNumber: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    source: {
        type: String,
        trim: true
    },
    documentUrl: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = { FundTransactionModel: mongoose.model('FundTransaction', FundTransactionSchema) };
