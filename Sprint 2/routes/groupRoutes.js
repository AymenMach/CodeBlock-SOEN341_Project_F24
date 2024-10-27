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
router.get('/groups', async (req, res) => {
  try {
    const groups = await Group.find().populate('participants', 'username');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

module.exports = router;
