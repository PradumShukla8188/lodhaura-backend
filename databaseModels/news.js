const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true, trim: true },
    content: { type: String, required: true },
    summary: { type: String, default: '' },
    featuredImage: { type: String, default: '' },
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    category: { type: mongoose.Types.ObjectId, ref: 'Category' },
    tags: [{ type: String, trim: true }],
    priority: { type: String, enum: ['normal', 'high', 'urgent'], default: 'normal' },
    attachments: [{ type: String }],
    expiryDate: { type: Date },
    likesCount: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'approved', 'active', 'inactive'], default: 'pending' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = { NewsModel: mongoose.model('News', NewsSchema) };
