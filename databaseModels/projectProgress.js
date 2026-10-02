const mongoose = require('mongoose');

const ProjectProgressSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    progressPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    workCompleted: {
        type: String,
        trim: true
    },
    workRemaining: {
        type: String,
        trim: true
    },
    photos: [{
        caption: String,
        url: String
    }],
    documents: [{
        title: String,
        url: String
    }],
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = { ProjectProgressModel: mongoose.model('ProjectProgress', ProjectProgressSchema) };
