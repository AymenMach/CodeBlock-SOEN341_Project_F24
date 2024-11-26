const mongoose = require('mongoose');

const peerAssessmentSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'groups', required: true },
  ratings: { type: Map, of: Number },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PeerAssessment', peerAssessmentSchema);
