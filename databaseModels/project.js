const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    scheme: { type: mongoose.Schema.Types.ObjectId, ref: 'GovernmentScheme' },
    category: { type: String, trim: true },
    description: { type: String, trim: true, default: '' },
    
    // Location
    location: { type: String, trim: true },
    village: { type: String, trim: true },
    ward: { type: String, trim: true },

    // Dates
    startDate: { type: Date },
    expectedCompletionDate: { type: Date },
    actualCompletionDate: { type: Date },

    // Status & Priority
    status: { 
        type: String, 
        enum: [
            'Proposed', 'Submitted', 'Under Review', 'Approved', 
            'Fund Sanctioned', 'Work Not Started', 'In Progress', 
            'On Hold', 'Delayed', 'Completed', 'Cancelled', 'Rejected'
        ],
        default: 'Proposed'
    },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },

    // Stakeholders
    assignedOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    contractor: { type: String, trim: true },

    // Financials
    estimatedCost: { type: Number, default: 0 },
    approvedBudget: { type: Number, default: 0 },
    releasedFund: { type: Number, default: 0 },
    spentAmount: { type: Number, default: 0 },
    fundingSource: { type: String, trim: true },
    governmentDepartment: { type: String, trim: true },

    // Progress
    progressPercentage: { type: Number, default: 0, min: 0, max: 100 },

    // Media
    documents: [{ title: String, url: String }],
    photos: [{ caption: String, url: String }],
    remarks: { type: String, trim: true },

    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

// Virtual field for remaining amount
ProjectSchema.virtual('remainingAmount').get(function() {
    return (this.releasedFund || 0) - (this.spentAmount || 0);
});

// Ensure virtuals are included in toJSON/toObject
ProjectSchema.set('toJSON', { virtuals: true });
ProjectSchema.set('toObject', { virtuals: true });

module.exports = { ProjectModel: mongoose.model('Project', ProjectSchema) };
