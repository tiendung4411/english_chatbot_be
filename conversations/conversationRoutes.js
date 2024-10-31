const express = require('express');
const router = express.Router();
const conversationController = require('./conversationControllers');

// Route to create a new conversation
router.post('/', conversationController.createConversation);

// Route to add a message to a conversation
router.post('/:conversationId/message', conversationController.addMessage);

// Route to get all conversations by userId
router.get('/user/:userId', conversationController.getConversationsByUserId);

// Route to get a specific conversation by conversationId
router.get('/:conversationId', conversationController.getConversationById);

// Route to delete a specific conversation by conversationId
router.delete('/:conversationId', conversationController.deleteConversation);
// Route to get all messages of a specific conversation
router.get('/:conversationId/messages', conversationController.getMessages);

// Route to delete a conversation
router.delete('/:conversationId', conversationController.deleteConversation);
module.exports = router;
