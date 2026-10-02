const mongoose = require('mongoose');

const InvestorInquirySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    organization: { type: String, trim: true, default: '' },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    investmentType: { type: String, required: true },
    website: { type: String, trim: true, default: '' },
    message: { type: String, required: true },
    status: { type: String, enum: ['pending', 'reviewed', 'contacted'], default: 'pending' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = { InvestorInquiryModel: mongoose.model('InvestorInquiry', InvestorInquirySchema) };
