const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = express.Router();
const app = express();
// DB Config
const db = require('./config/keys').mongoURI;

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Express body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));


app.get('/', (req, res) => {
    res.send('The server is running successfully.');
});




const conversationRoutes = require('./conversations/conversationRoutes');
const chatRoutes = require('./chat/chatRoutes');
const userRoutes = require('./users/userRoutes');
const responseRoutes = require('./responses/responseRoutes');

app.use('/users', userRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/responses', responseRoutes);
app.use('/api/chats', chatRoutes);




const port = 3500;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
