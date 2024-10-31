const express = require('express');
const Group = require('../models/group'); 
const User = require('../models/user');   
const router = express.Router();

// Fetch all groups with populated student usernames
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find().populate('students', 'username');
    res.status(200).json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ message: 'Error fetching groups' });
  }
});

// Create a new group
router.post('/create', async (req, res) => {
  const { name } = req.body;

  try {
    const existingGroup = await Group.findOne({ name });
    if (existingGroup) {
      return res.status(400).json({ message: 'Group name already exists' });
    }

    // Initialize participants as an empty array
    const newGroup = new Group({ name, students: [], participants: [] });
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Error creating group' });
  }
});

// Assign students to a group
router.post('/assign', async (req, res) => {
  const { groupId, studentIds } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const students = await User.find({ _id: { $in: studentIds }, role: 'student' });
    if (students.length !== studentIds.length) {
      return res.status(400).json({ message: 'Some students not found' });
    }

    group.students.push(...students.map(student => student._id));
    await group.save();
    res.status(200).json(group);
  } catch (error) {
    console.error('Error assigning students:', error);
    res.status(500).json({ message: 'Error assigning students' });
  }
});

// Add participants to a group
router.post('/add-participant', async (req, res) => {
  const { groupId, participantName } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if the participant already exists
    if (group.participants.includes(participantName)) {
      return res.status(400).json({ message: 'Participant already exists in the group' });
    }

    group.participants.push(participantName);
    await group.save();
    res.status(200).json(group);
  } catch (error) {
    console.error('Error adding participant:', error);
    res.status(500).json({ message: 'Error adding participant' });
  }
});

module.exports = router;
