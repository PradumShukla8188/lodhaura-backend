const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true, trim: true },
    description: { type: String, default: '' },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    location: { type: String, default: '' },
    featuredImage: { type: String, default: '' },
    organizer: { type: String, default: '' },
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    category: { type: mongoose.Types.ObjectId, ref: 'Category' },
    status: { type: String, enum: ['pending', 'approved', 'active', 'inactive'], default: 'pending' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = { EventModel: mongoose.model('Event', EventSchema) };
