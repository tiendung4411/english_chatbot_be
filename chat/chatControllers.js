const Chat = require('./chatModel');
const Conversation = require('../conversations/conversationModel');

// Add a message to a conversation
exports.addMessageToConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { message, messageType } = req.body;  // Expecting message and type (User/Bot) in the body

        // Ensure the conversation exists
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        const chat = new Chat({
            conversationId,
            message,
            messageType
        });
        await chat.save();

        res.status(201).json({
            message: 'Message added successfully',
            chat
        });
    } catch (error) {
        res.status(500).json({ error: 'Could not add message' });
    }
};

// Get all messages in a conversation
exports.getMessagesByConversationId = async (req, res) => {
    try {
        const { conversationId } = req.params;

        const messages = await Chat.find({ conversationId });
        if (!messages || messages.length === 0) {
            return res.status(404).json({ error: 'No messages found in this conversation' });
        }

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching messages' });
    }
};
