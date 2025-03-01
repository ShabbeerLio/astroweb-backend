require('dotenv').config()
const connectToMongo = require('./db');
connectToMongo();
const express = require('express');
const cors = require('cors');


// Connect to MongoDB
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Available routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/detail', require('./routes/detail'));
app.use('/api/admindetail', require('./routes/adminDetail'));

app.get('/', (req, res) => {
    res.json({ message: 'Hello MERN Stack!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Astroweb listening on port ${PORT}`);
});