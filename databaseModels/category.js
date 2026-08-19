const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true, trim: true },
    type: {
        type: String,
        enum: ['blog', 'news', 'event', 'scheme', 'service', 'general'],
        default: 'general',
    },
    description: { type: String, default: '' },
    icon: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = { CategoryModel: mongoose.model('Category', CategorySchema) };
