const mongoose = require('mongoose');

const ActionItemSchema = new mongoose.Schema({
    task: { type: String, required: true },
    responsiblePerson: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dueDate: { type: Date },
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }
});

const MeetingSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    location: { type: String, trim: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    agenda: { type: String, required: true },
    decisions: { type: String, trim: true },
    minutes: { type: String, trim: true },
    attachments: [{ title: String, url: String }],
    actionItems: [ActionItemSchema],
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = { MeetingModel: mongoose.model('Meeting', MeetingSchema) };
