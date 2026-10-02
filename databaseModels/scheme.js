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
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    level: { type: String, enum: ['Central', 'State', 'Local'], default: 'State' },
    startDate: { type: Date },
    endDate: { type: Date },
    officialWebsite: { type: String, trim: true },
    officialDocuments: [{ title: String, url: String }],
    applicableVillage: { type: String, trim: true },
    responsibleOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['active', 'inactive', 'upcoming', 'closed'], default: 'active' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = { SchemeModel: mongoose.model('Scheme', SchemeSchema) };
