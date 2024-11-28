const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Ensure you import your user model correctly

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password) { // Direct comparison without bcrypt
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.status(200).json({ role: user.role, username: user.username, studentId: user.studentId });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
