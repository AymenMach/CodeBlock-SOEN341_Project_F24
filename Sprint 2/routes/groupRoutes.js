const express = require('express');
const router = express.Router();
const Group = require('../models/Group');

// Create a new group and assign students
router.post('/groups', async (req, res) => {
  const { name, studentIds } = req.body;

  try {
    const group = new Group({
      name,
      participants: studentIds,
    });
    await group.save();
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// Get all groups
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find().populate('participants', 'username');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

// Get student's group(s) by student ID
router.get('/student', async (req, res) => {
  const { userId } = req.query;
  try {
    const groups = await Group.find({ participants: userId }).populate('participants', 'username');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student groups' });
  }
});

module.exports = router;
