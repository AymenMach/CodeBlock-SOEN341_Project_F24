// group.js
const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  evaluator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  evaluatee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true }, // Score for the Cooperation dimension
  feedback: { type: String }, // Optional feedback
});

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  evaluations: [evaluationSchema], // Array of evaluations for peer assessment
});

module.exports = mongoose.model('Group', groupSchema);
