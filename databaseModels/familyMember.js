const mongoose = require('mongoose');

const FamilyMemberSchema = new mongoose.Schema({
    residentProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'ResidentProfile', required: true },
    name: { type: String, required: true, trim: true },
    relationship: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date },
    occupation: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = { FamilyMemberModel: mongoose.model('FamilyMember', FamilyMemberSchema) };
