const mongoose = require('mongoose');

const SchemeSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true, trim: true },
    description: { type: String, required: true },
    eligibility: { type: String, default: '' },
    benefits: { type: String, default: '' },
    applicationProcess: { type: String, default: '' },
    featuredImage: { type: String, default: '' },
    category: { type: mongoose.Types.ObjectId, ref: 'Category' },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ['active', 'inactive', 'expired'], default: 'active' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = { SchemeModel: mongoose.model('Scheme', SchemeSchema) };
