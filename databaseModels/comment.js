const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    targetType: {
        type: String,
        enum: ['blog', 'news', 'event', 'video', 'image'],
        required: true,
    },
    targetId: { type: mongoose.Types.ObjectId, required: true },
    content: { type: String, required: true, trim: true },
    parentId: { type: mongoose.Types.ObjectId, ref: 'Comment', default: null },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = { CommentModel: mongoose.model('Comment', CommentSchema) };
