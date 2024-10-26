const Conversation = require('./conversationModel');

// Start a new conversation
exports.startConversation = async (req, res) => {
    try {
        const { userId } = req.body;  // Assume userId is coming from the request
        const conversation = new Conversation({
            userId,
            startTime: new Date(),
        });
        await conversation.save();
        res.status(201).json({
            message: 'Conversation started successfully',
            conversation
        });
    } catch (error) {
        res.status(500).json({ error: 'Could not start conversation' });
    }
};

// End a conversation
exports.endConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const conversation = await Conversation.findByIdAndUpdate(
            conversationId,
            { endTime: new Date() },
            { new: true }
        );

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        res.status(200).json({
            message: 'Conversation ended successfully',
            conversation
        });
    } catch (error) {
        res.status(500).json({ error: 'Could not end conversation' });
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
