const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: '',
    },
    coverPhoto: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        default: '',
    },
    refreshToken: {
        type: String,
        default: '',
    },
    resetPasswordToken: {
        type: String,
        default: '',
    },
    resetPasswordExpires: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    themePreference: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system',
    },
    followersCount: {
        type: Number,
        default: 0,
    },
    followingCount: {
        type: Number,
        default: 0,
    },
    roleId: {
        type: mongoose.Types.ObjectId,
        ref: 'Role',
        required: true,
    },
    additionalRoles: [{
        type: mongoose.Types.ObjectId,
        ref: 'Role',
    }],
    department: {
        type: mongoose.Types.ObjectId,
        ref: 'Department',
    },
    designation: {
        type: String,
        trim: true,
    },
    employeeId: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = { UserModel: mongoose.model('User', UserSchema) };
