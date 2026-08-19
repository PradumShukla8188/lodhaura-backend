const mongoose = require('mongoose');

const VillageInfoSchema = new mongoose.Schema({
    name: { type: String, required: true, default: 'Lodhaura' },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    history: { type: String, default: '' },
    location: {
        district: { type: String, default: '' },
        state: { type: String, default: 'Uttar Pradesh' },
        country: { type: String, default: 'India' },
        pincode: { type: String, default: '' },
        coordinates: {
            lat: { type: Number },
            lng: { type: Number },
        },
    },
    population: { type: Number, default: 0 },
    establishedYear: { type: String, default: '' },
    images: [{ type: String }],
    coverImage: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    socialLinks: {
        facebook: { type: String, default: '' },
        twitter: { type: String, default: '' },
        instagram: { type: String, default: '' },
        youtube: { type: String, default: '' },
    },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = { VillageInfoModel: mongoose.model('VillageInfo', VillageInfoSchema) };
