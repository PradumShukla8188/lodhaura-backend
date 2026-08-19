const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
    caption: { type: String, default: '' },
    album: { type: String, default: 'general' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = { ImageModel: mongoose.model('Image', ImageSchema) };
