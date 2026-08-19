const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    targetType: {
        type: String,
        enum: ['blog', 'news', 'event', 'video', 'image', 'comment'],
        required: true,
    },
    targetId: { type: mongoose.Types.ObjectId, required: true },
}, { timestamps: true });

LikeSchema.index({ userId: 1, targetType: 1, targetId: 1 }, { unique: true });

module.exports = { LikeModel: mongoose.model('Like', LikeSchema) };
