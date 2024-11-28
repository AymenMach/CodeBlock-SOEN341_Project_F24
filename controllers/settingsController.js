const PeerAssessmentSettings = require('../models/peerAssessmentSettings');

// function to save peer assessment settings
const savePeerAssessmentSettings = async (req, res) => {
  const { isEnabled, timestamp } = req.body;

  try {
    const settings = new PeerAssessmentSettings({
      isEnabled,
      timestamp,
    });

    // Save to the database
    await settings.save();

    res.status(200).json({ message: 'Peer assessment settings saved successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving peer assessment settings.' });
  }
};

// function to fetch peer assessment history
const getPeerAssessmentHistory = async (req, res) => {
  try {
    const history = await PeerAssessmentSettings.find().sort({ timestamp: -1 }); 
    res.status(200).json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching peer assessment history.' });
  }
};

module.exports = { savePeerAssessmentSettings, getPeerAssessmentHistory };
