const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    messageType: {
        type: String,
        enum: ['User', 'Bot'],
        required: true
    }
});

module.exports = mongoose.model('Chat', chatSchema);
