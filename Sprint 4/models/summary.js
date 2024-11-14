const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  groupName: { type: String, required: true },
  averageRating: { type: Number, required: true },
  participantCount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Summary = mongoose.model('Summary', summarySchema);

module.exports = Summary;
