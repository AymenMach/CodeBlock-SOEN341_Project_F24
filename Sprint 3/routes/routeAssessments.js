const express = require('express');
const assessment = require('../models/assessment');
const router = express.Router();

router.post('/', async (req, res) => {
  const { evaluatedStudent, cooperationScore } = req.body;
  const evaluator = req.user.id;

  try {
    const newAssessment = new Assessment({ evaluatedStudent, evaluator, cooperationScore });
    await newAssessment.save();
    res.status(201).json({ message: 'Assessment submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting assessment' });
  }
});

module.exports = router;