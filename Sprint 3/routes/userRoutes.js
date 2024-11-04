const express = require('express');
const { loginUser } = require('../controllers/userController'); 
const User = require('../models/newUser'); 
const router = express.Router();

router.post('/login', loginUser); 

router.get('/', async (req, res) => {
  try {
    const users = await User.find(); 
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Registration endpoint
router.post('/', async (req, res) => { 
  const { fullName, username, password, studentId } = req.body;

  try {
    const newUser = new User({
      name: fullName,
      username,
      password,
      studentId, 
      role: 'student', 
    });

    await newUser.save();
    return res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Error registering user' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
