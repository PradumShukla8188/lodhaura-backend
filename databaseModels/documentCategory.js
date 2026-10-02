const mongoose = require('mongoose');

const DocumentCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = { DocumentCategoryModel: mongoose.model('DocumentCategory', DocumentCategorySchema) };
