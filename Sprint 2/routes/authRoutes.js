const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    res.status(200).json({ success: true, userId: user._id, role: user.role });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});
module.exports = router;
