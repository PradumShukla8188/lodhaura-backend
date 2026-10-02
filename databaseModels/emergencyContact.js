const mongoose = require('mongoose');

const EmergencyContactSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ['Ambulance', 'Police', 'Fire', 'Hospital', 'Clinic', 'Pharmacy', 'Village Emergency', 'Other'] },
    phone: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    locationLink: { type: String, trim: true }, // Google Maps link
    description: { type: String, trim: true },
    isAvailable24x7: { type: Boolean, default: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = { EmergencyContactModel: mongoose.model('EmergencyContact', EmergencyContactSchema) };
