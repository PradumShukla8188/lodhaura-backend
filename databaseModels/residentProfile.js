const mongoose = require('mongoose');

const ResidentProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
    maritalStatus: { type: String, enum: ['single', 'married', 'widowed', 'divorced', 'separated'], default: 'single' },
    occupation: { type: String, trim: true },
    educationLevel: { type: String, trim: true },
    
    // Address Details
    houseNumber: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    village: { type: String, default: 'Lodhaura', trim: true },
    postOffice: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    
    // Family Info
    familyHeadName: { type: String, required: true, trim: true },
    emergencyContact: { type: String, trim: true },
    
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = { ResidentProfileModel: mongoose.model('ResidentProfile', ResidentProfileSchema) };
