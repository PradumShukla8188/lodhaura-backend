const mongoose = require('mongoose');

const NewsletterSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    status: { type: String, enum: ['active', 'unsubscribed'], default: 'active' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = { NewsletterModel: mongoose.model('Newsletter', NewsletterSchema) };
