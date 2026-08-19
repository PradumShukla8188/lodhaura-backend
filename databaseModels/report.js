const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    reporterId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    targetType: {
        type: String,
        enum: ['blog', 'news', 'event', 'video', 'image', 'comment', 'user'],
        required: true,
    },
    targetId: { type: mongoose.Types.ObjectId, required: true },
    reason: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'reviewed', 'resolved', 'dismissed'], default: 'pending' },
}, { timestamps: true });

module.exports = { ReportModel: mongoose.model('Report', ReportSchema) };
