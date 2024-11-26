const express = require('express');
const Group = require('../models/group');
const User = require('../models/user');
const router = express.Router();

// Fetch all groups with populated student usernames
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ message: 'Error fetching groups' });
  }
});

// Route to get participants by group ID
router.get('/:groupId/participants', async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json(group.participants);
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ message: 'Internal server error' });
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

// Remove a participant from a group
router.post('/remove-participant', async (req, res) => {
  const { groupId, participantName } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if the participant exists in the group
    if (!group.participants.includes(participantName)) {
      return res.status(400).json({ message: 'Participant not found in the group' });
    }

    // Remove the participant from the participants array
    group.participants = group.participants.filter(participant => participant !== participantName);
    await group.save();
    res.status(200).json(group);
  } catch (error) {
    console.error('Error removing participant:', error);
    res.status(500).json({ message: 'Failed to remove participant' });
  }
});

// Add a comment
router.post('/add-comment', async (req, res) => {
  const { groupId, studentId, comment } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    group.comments.push({ studentId, comment });
    await group.save();
    res.status(200).json(group);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Error adding comment' });
  }
});

// Delete a group
router.delete('/:id', async (req, res) => {
  try {
    const groupId = req.params.id;
    const deletedGroup = await Group.findByIdAndDelete(groupId);
    if (!deletedGroup) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:groupId/members', async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId).populate('members');
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json(group.members);
  } catch (error) {
    console.error('Error fetching group members:', error);
    res.status(500).json({ message: 'Failed to fetch group members' });
  }
});
module.exports = router;
