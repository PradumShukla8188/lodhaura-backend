const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: '' },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['new', 'read', 'replied', 'closed'], default: 'new' },
}, { timestamps: true });

module.exports = { ContactModel: mongoose.model('Contact', ContactSchema) };
