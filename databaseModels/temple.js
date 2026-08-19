const mongoose = require('mongoose');

const TempleSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    deity: { type: String, default: '' },
    location: { type: String, default: '' },
    image: { type: String, default: '' },
    timings: { type: String, default: '' },
    festivals: [{ type: String }],
    contactPhone: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = { TempleModel: mongoose.model('Temple', TempleSchema) };
