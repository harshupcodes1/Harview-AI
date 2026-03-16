const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jobPosition: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    language: {
        type: String,
        default: 'English'
    },
    questions: {
        type: Array, // Array of evaluated answers from Gemini
        default: []
    },
    overallRating: {
        type: Number
    },
    overallFeedback: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Interview', interviewSchema);
