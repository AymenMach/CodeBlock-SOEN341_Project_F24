const express = require('express');
const { loginInstructor } = require('../controllers/instructorController'); 
const Instructor = require('../models/Instructor'); 
const router = express.Router();

// Login endpoint for instructors
router.post('/login', loginInstructor);


router.get('/', async (req, res) => {
  try {
    const instructors = await Instructor.find(); 
    res.json(instructors);
  } catch (error) {
    console.error('Error fetching instructors:', error);
    res.status(500).json({ message: 'Failed to fetch instructors' });
  }
});

// Registration endpoint for instructors
router.post('/', async (req, res) => { 
  const { fullName, username, password } = req.body; 

  try {
    const newInstructor = new Instructor({
      name: fullName,
      username,
      password,
      role: 'instructor',
    });

    await newInstructor.save();
    return res.status(201).json({ message: 'Instructor registered successfully!' });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Error registering instructor' });
  }
});

module.exports = router;
