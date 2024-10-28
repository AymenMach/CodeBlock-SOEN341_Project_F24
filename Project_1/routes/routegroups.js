const express = require('express');
const group = require('../models/group');
const user = require('../models/user');
const router = express.Router();

// Fetch all groups
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find().populate('students', 'username');
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching groups' });
  }
});

// Create a new group
router.post('/create', async (req, res) => {
  const { name } = req.body;
  try {
    const existingGroup = await Group.findOne({ name });
    if (existingGroup) return res.status(400).json({ message: 'Group name already exists' });

    const newGroup = new Group({ name, students: [] });
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ message: 'Error creating group' });
  }
});

// Assign students to a group
router.post('/assign', async (req, res) => {
  const { groupId, studentIds } = req.body;
  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const students = await User.find({ _id: { $in: studentIds }, role: 'student' });
    if (students.length !== studentIds.length) {
      return res.status(400).json({ message: 'Some students not found' });
    }

    group.students.push(...students.map(student => student._id));
    await group.save();
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error assigning students' });
  }
});

module.exports = router;

