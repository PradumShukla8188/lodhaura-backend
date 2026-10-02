const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    documentType: {
        type: String,
        enum: [
            'Government Order', 'Panchayat Document', 'Project Document',
            'Fund Document', 'Meeting Minutes', 'Scheme Document',
            'Report', 'Certificate', 'Development Photo', 'Other'
        ],
        required: true
    },
    url: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    relatedProject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    relatedScheme: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GovernmentScheme'
    },
    visibility: {
        type: String,
        enum: ['Public', 'Internal'],
        default: 'Internal'
    },
    version: {
        type: String,
        trim: true,
        default: '1.0'
    },
    verificationStatus: {
        type: String,
        enum: ['Verified', 'Unverified', 'Under Verification', 'Outdated', 'Cancelled'],
        default: 'Unverified'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = { DocumentModel: mongoose.model('Document', DocumentSchema) };
