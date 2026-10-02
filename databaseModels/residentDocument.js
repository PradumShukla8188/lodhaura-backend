const mongoose = require('mongoose');

const ResidentDocumentSchema = new mongoose.Schema({
    residentProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'ResidentProfile', required: true },
    documentTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: 'DocumentTemplate', required: true },
    status: { 
        type: String, 
        enum: ['Have Document', 'Applied', 'Pending', 'Not Applicable', 'Needs Renewal/Correction'], 
        default: 'Pending' 
    },
    uploadedFileUrl: { type: String, trim: true }, // Optional private upload
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

// Prevent duplicate statuses for the same document and resident
ResidentDocumentSchema.index({ residentProfileId: 1, documentTemplateId: 1 }, { unique: true });

module.exports = { ResidentDocumentModel: mongoose.model('ResidentDocument', ResidentDocumentSchema) };
