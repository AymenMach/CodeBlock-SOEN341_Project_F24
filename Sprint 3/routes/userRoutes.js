const express = require('express');
const { loginUser } = require('../controllers/userController'); 
const User = require('../models/User'); // Import your User model

const router = express.Router();

// POST /api/users/login - for user login
router.post('/login', loginUser); 

// GET /api/users - for fetching all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find(); // Fetch users from the database
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

module.exports = router;