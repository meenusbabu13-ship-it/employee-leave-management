require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
const allowedOrigin = process.env.FRONTEND_URL || '*';
app.use(cors({
  origin: allowedOrigin === '*' ? '*' : allowedOrigin,
  credentials: allowedOrigin !== '*'
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🍃 Success! Connected to MongoDB Database successfully.'))
  .catch((err) => console.error('❌ Database connection error:', err));

// Link your Route Files here 👇
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leave', require('./routes/leave')); // <-- Add this line!

// Test Route
app.get('/', (req, res) => {
  res.send('Welcome! The Employee Leave Management Server is Alive and Working!');
});

// Start the server and keep it listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎉 Success! Your server is running at http://localhost:${PORT}`);
});