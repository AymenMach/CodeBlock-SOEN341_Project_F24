const express = require('express');
const Group = require('./models/Group');
const router = express.Router();

router.get('/groups', async (req, res) => {
  try {
    const groups = await Group.find().populate('students', 'username');
    res.status(200).json(groups);
  }
  catch (error) {
    res.status(500).json({ message: 'Error routing groups' });
  }
});

module.exports = router;
