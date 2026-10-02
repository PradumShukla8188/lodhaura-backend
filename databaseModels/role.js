const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    displayValue: {
        type: String,
        required: true,
        trim:true
    },
    code: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    permissions: [{
        module: { type: String, required: true },
        action: { type: String, required: true }
    }],
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = {RoleModel :mongoose.model('Role', RoleSchema)};