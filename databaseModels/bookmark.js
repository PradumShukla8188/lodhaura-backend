const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    targetType: {
        type: String,
        enum: ['blog', 'news', 'event', 'video', 'scheme'],
        required: true,
    },
    targetId: { type: mongoose.Types.ObjectId, required: true },
}, { timestamps: true });

BookmarkSchema.index({ userId: 1, targetType: 1, targetId: 1 }, { unique: true });

module.exports = { BookmarkModel: mongoose.model('Bookmark', BookmarkSchema) };
