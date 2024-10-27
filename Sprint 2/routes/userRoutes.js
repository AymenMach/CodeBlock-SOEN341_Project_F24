const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all students
router.get('/students', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Update a student’s profile
router.put('/students/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedStudent = await User.findByIdAndUpdate(id, updatedData, { new: true });
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update student profile' });
  }
});

module.exports = router;
