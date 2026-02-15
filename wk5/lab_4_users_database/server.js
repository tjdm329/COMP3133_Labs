const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Router = require('./routes/users'); 

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 8081;
const MONGO_URI = process.env.MONGO_URI || "";

// Middleware
app.use(express.json()); 
app.use('/users', Router); // http://localhost:8081/users

// MongoDB connection -------------------------
mongoose.connect(MONGO_URI); 
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop');
});