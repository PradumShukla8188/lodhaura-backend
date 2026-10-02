const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { 
        type: String, 
        enum: ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Citizen Confirmation', 'Closed', 'pending', 'resolved', 'dismissed'], 
        default: 'Submitted' 
    },
    resolutionRemarks: { type: String, trim: true },
    resolvedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = { ComplaintModel: mongoose.model('Complaint', ComplaintSchema) };
