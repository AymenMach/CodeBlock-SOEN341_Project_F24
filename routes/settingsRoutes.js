const express = require('express');
const { savePeerAssessmentSettings, getPeerAssessmentHistory } = require('../controllers/settingsController');
const router = express.Router();

// route for saving peer assessment settings
router.post('/api/peer-assessment-settings', savePeerAssessmentSettings);

// route for fetching peer assessment settings
router.get('/api/peer-assessment-settings', getPeerAssessmentHistory);

module.exports = router;
