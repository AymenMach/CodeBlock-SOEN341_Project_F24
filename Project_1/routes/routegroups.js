const express = require('express');
const Group = require('../models/Group');
const user = require('../models/user');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const groups = await Group.find().populate('students', 'username');
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching groups' });
  }
});

module.exports = router;

