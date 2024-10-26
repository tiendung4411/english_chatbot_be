const Response = require('./responseModel');
const Chat = require('../chat/chatModel');

// Add a response to a chat message
exports.addResponseToChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { geminiResponse } = req.body;  // Expecting the AI's response in the body

        // Ensure the chat message exists
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ error: 'Chat message not found' });
        }

        const response = new Response({
            chatId,
            geminiResponse,
            createdAt: new Date()
        });
        await response.save();

        res.status(201).json({
            message: 'Response added successfully',
            response
        });
    } catch (error) {
        res.status(500).json({ error: 'Could not add response' });
    }
};

// Get all responses for a specific chat message
exports.getResponsesByChatId = async (req, res) => {
    try {
        const { chatId } = req.params;

        const responses = await Response.find({ chatId });
        if (!responses || responses.length === 0) {
            return res.status(404).json({ error: 'No responses found for this chat message' });
        }

        res.status(200).json(responses);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching responses' });
    }
};
