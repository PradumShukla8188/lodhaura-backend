const mongoose = require('mongoose');

const SuggestionSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    topic: { type: String, required: true, trim: true },
    suggestion: { type: String, required: true },
    status: { type: String, enum: ['pending', 'reviewed', 'implemented'], default: 'pending' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = { SuggestionModel: mongoose.model('Suggestion', SuggestionSchema) };
