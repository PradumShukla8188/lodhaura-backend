const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    companyName: { type: String, trim: true },
    location: { type: String, required: true, trim: true },
    salary: { type: String, trim: true }, // e.g. "15000/month"
    description: { type: String, required: true },
    requirements: { type: String, trim: true },
    contactPhone: { type: String, required: true },
    status: { type: String, enum: ['active', 'filled', 'inactive'], default: 'active' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = { JobModel: mongoose.model('Job', JobSchema) };
