const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    duration: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'approved', 'active', 'inactive'], default: 'pending' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = { VideoModel: mongoose.model('Video', VideoSchema) };
