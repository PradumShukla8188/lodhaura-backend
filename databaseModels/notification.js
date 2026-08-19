const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ['info', 'success', 'warning', 'error', 'system'],
        default: 'info',
    },
    relatedType: { type: String, default: '' },
    relatedId: { type: mongoose.Types.ObjectId },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = { NotificationModel: mongoose.model('Notification', NotificationSchema) };
