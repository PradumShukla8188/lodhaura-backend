const mongoose = require('mongoose');

const SchoolSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    type: { type: String, enum: ['primary', 'secondary', 'higher_secondary', 'other'], default: 'primary' },
    location: { type: String, default: '' },
    image: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    principal: { type: String, default: '' },
    establishedYear: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = { SchoolModel: mongoose.model('School', SchoolSchema) };
