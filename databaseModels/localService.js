const mongoose = require('mongoose');

const LocalServiceSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User' }, // Owner of the business
    businessName: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    locationLink: { type: String, trim: true }, // Map link
    openingHours: { type: String, trim: true },
    photos: [{ type: String }],
    servicesOffered: [{ type: String }],
    verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = { LocalServiceModel: mongoose.model('LocalService', LocalServiceSchema) };
