const express = require('express');
const router = express.Router();
const conversationController = require('./conversationControllers');

// Route to start a new conversation
router.post('/start', conversationController.startConversation);

// Route to end an existing conversation
router.put('/end/:conversationId', conversationController.endConversation);

// Route to get all conversations by userId
router.get('/user/:userId', conversationController.getConversationsByUserId);

// Route to get a specific conversation by conversationId
router.get('/:conversationId', conversationController.getConversationById);

module.exports = router;
