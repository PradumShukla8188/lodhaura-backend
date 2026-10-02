const mongoose = require('mongoose');

const DocumentTemplateSchema = new mongoose.Schema({
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'DocumentCategory', required: true },
    name: { type: String, required: true, trim: true },
    purpose: { type: String, trim: true },
    eligibility: { type: String, trim: true },
    applicationSteps: { type: String, trim: true },
    officialLink: { type: String, trim: true },
    requiredSupportingDocs: { type: String, trim: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = { DocumentTemplateModel: mongoose.model('DocumentTemplate', DocumentTemplateSchema) };
