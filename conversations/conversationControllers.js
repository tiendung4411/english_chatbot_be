const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyDWjUQRYSuewc-XNRaT6Q8q0JNrwEtYt5M");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const Conversation = require('./conversationModel');

// Prompt to guide the AI response for English learning
const learningPrompt = "You are an English teacher focusing on grammar and vocabulary enhancement for Vietnamese teenagers. When a user asks about a grammar point, provide clear explanations in Vietnamese with English examples. If the user struggles with vocabulary, suggest synonyms and example sentences in English, but explain them in Vietnamese. Engage them with short exercises, such as asking them to form a sentence using the new word or grammar rule they just learned. Your tone should be encouraging and supportive, using Vietnamese. Additionally, be cautious about inappropriate language or topics. If you detect any such content, respond by informing the user politely that such language is not acceptable.";

exports.addMessage = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { message, sender } = req.body;

        // Check if all required data is present
        if (!message || !sender) {
            return res.status(400).json({ error: 'Message and sender are required' });
        }

        // Find the conversation
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        // Save the user's message
        conversation.messages.push({ message, sender });
        conversation.updatedAt = new Date();
        await conversation.save();

        // If the sender is the user, call the AI to generate a response
        if (sender === 'User') {
            const conversationHistory = conversation.messages
                .map((msg) => `${msg.sender}: ${msg.message}`)
                .join('\n');

            // Combine the learning prompt with the conversation history and user's new message
            const fullPrompt = `${learningPrompt}\n\n${conversationHistory}\nUser: ${message}\nBot:`;

            try {
                // Use the correct method for generating content
                const result = await model.generateContent(fullPrompt);
                const response = await result.response;
                const botMessage = await response.text();

                // Save AI's response
                conversation.messages.push({ message: botMessage, sender: 'Bot' });
                conversation.updatedAt = new Date();
                await conversation.save();

                res.status(200).json({
                    message: 'Message added successfully',
                    conversation,
                });
            } catch (aiError) {
                console.error('Error with AI response generation:', aiError);
                return res.status(500).json({ error: 'AI response generation failed' });
            }
        } else {
            // If the message sender is not the user, just return the conversation
            res.status(200).json({
                message: 'Message added successfully',
                conversation,
            });
        }
    } catch (error) {
        console.error('Error in addMessage:', error);
        res.status(500).json({ error: 'Could not add message' });
    }
};

// Create a new conversation
exports.createConversation = async (req, res) => {
    try {
        const { userId } = req.body;
        const conversation = new Conversation({ userId });
        await conversation.save();
        res.status(201).json({
            message: 'Conversation created successfully',
            conversation
        });
    } catch (error) {
        res.status(500).json({ error: 'Could not create conversation' });
    }
};

// Add a message to a conversation
// Get all messages from a specific conversation
exports.getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;

        // Find the conversation by its ID
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        // Return the messages
        res.status(200).json(conversation.messages);
    } catch (error) {
        console.error('Error in getMessages:', error);
        res.status(500).json({ error: 'Error fetching messages' });
    }
};


// Get all conversations by userId
exports.getConversationsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const conversations = await Conversation.find({ userId });

        if (!conversations || conversations.length === 0) {
            return res.status(404).json({ error: 'No conversations found for this user' });
        }

        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching conversations' });
    }
};

// Get a specific conversation by conversationId
exports.getConversationById = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching conversation' });
    }
};

// Delete a conversation
exports.deleteConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const conversation = await Conversation.findByIdAndDelete(conversationId);

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        res.status(200).json({ message: 'Conversation deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting conversation' });
    }
};
