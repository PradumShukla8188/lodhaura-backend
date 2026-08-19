const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    featuredImage: {
        type: String,
        default: '',
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
    },
    tags: [{
        type: String,
        trim: true,
    }],
    likesCount: {
        type: Number,
        default: 0,
    },
    readingTime: {
        type: Number,
        default: 1,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'active', 'inactive'],
        default: 'pending',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = { BlogModel: mongoose.model('Blog', BlogSchema) };
