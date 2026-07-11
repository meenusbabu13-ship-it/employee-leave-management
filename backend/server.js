const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Tell our server to accept incoming messages safely
app.use(cors());
app.use(express.json());

// Create a friendly test message when we open the server in our browser
app.get('/', (req, res) => {
  res.send('Welcome! The Employee Leave Management Server is Alive and Working!');
});

// Choose a computer port to run on (Port 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎉 Success! Your server is running at http://localhost:${PORT}`);
});