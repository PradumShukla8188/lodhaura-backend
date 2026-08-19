const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    provider: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    location: { type: String, default: '' },
    category: { type: mongoose.Types.ObjectId, ref: 'Category' },
    image: { type: String, default: '' },
    availability: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = { ServiceModel: mongoose.model('Service', ServiceSchema) };
