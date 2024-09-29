const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import User model

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    
    // Check if the user exists and the password matches
    if (user && user.password === password) {
      // Successful login
      res.status(200).json({ message: 'Login successful', user });
    } else {
      // Invalid credentials
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;