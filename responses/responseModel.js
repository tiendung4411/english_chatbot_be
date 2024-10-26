const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    responseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    geminiResponse: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('Response', responseSchema);
