const express = require('express');
const router = express.Router();
const responseController = require('./responseControllers');

// Route to add a response to a chat message
router.post('/add/:chatId', responseController.addResponseToChat);

// Route to get all responses by chatId
router.get('/:chatId', responseController.getResponsesByChatId);

module.exports = router;
