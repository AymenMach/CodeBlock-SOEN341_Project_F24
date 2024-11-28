const mongoose = require('mongoose');

const peerAssessmentSettingsSchema = new mongoose.Schema({
  isEnabled: {
    type: Boolean,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('PeerAssessmentSettings', peerAssessmentSettingsSchema);
