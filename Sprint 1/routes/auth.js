const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import User model

// Login Route
router.post('/login', async (req, res) => {
  const { username, password, role } = req.body; // Include role in the request

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    // Check if the user exists and the password matches
    if (user && user.password === password) {
      // Check if the role matches
      if (user.role === role) {
        // Successful login
        return res.status(200).json({ message: 'Login successful', user });
      } else {
        // Role mismatch
        return res.status(403).json({ message: 'Role mismatch. Please ensure your selected role matches your credentials.' });
      }
    } else {
      // Invalid credentials
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;