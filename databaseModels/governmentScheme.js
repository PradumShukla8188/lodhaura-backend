const mongoose = require('mongoose');

const GovernmentSchemeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    code: {
        type: String,
        trim: true,
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    level: {
        type: String,
        enum: ['Central', 'State', 'Local'],
        default: 'State'
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    eligibility: {
        type: String,
        trim: true,
        default: ''
    },
    benefits: {
        type: String,
        trim: true,
        default: ''
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Upcoming', 'Closed'],
        default: 'Active'
    },
    officialWebsite: {
        type: String,
        trim: true,
    },
    officialDocuments: [{
        title: String,
        url: String
    }],
    applicableVillage: {
        type: String,
        trim: true,
    },
    responsibleOfficer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = { GovernmentSchemeModel: mongoose.model('GovernmentScheme', GovernmentSchemeSchema) };
