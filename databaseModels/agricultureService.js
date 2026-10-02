const mongoose = require('mongoose');

const AgricultureServiceSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    providerName: { type: String, required: true, trim: true },
    type: { type: String, enum: ['Tractor Rental', 'Harvester', 'Seeds & Fertilizer', 'Water Pump', 'Labor', 'Other'], required: true },
    description: { type: String, required: true },
    phone: { type: String, required: true },
    priceRate: { type: String, trim: true }, // e.g. "500 Rs/hour"
    address: { type: String, trim: true },
    isAvailable: { type: Boolean, default: true },
    photos: [{ type: String }],
    verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = { AgricultureServiceModel: mongoose.model('AgricultureService', AgricultureServiceSchema) };
