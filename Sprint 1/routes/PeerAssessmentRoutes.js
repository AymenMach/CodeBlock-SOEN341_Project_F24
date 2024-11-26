const express = require('express');
const router = express.Router();
const PeerAssessment = require('../models/PeerAssessment');

router.post('/submit', async (req, res) => {
  const { groupId, ratings } = req.body;
  try {
    await PeerAssessment.create({ groupId, ratings, timestamp: new Date() });
    res.status(200).json({ message: 'Assessment Submitted' });
  } catch (e) {
    res.status(500).json({ message: 'Submission Failed' });
  }
});

module.exports = router;
