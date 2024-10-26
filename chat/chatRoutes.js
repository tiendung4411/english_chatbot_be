const express = require('express');
const router = express.Router();
const chatController = require('./chatControllers');

// Route to add a message to a conversation
router.post('/add/:conversationId', chatController.addMessageToConversation);

// Route to get all messages by conversationId
router.get('/:conversationId', chatController.getMessagesByConversationId);

module.exports = router;
