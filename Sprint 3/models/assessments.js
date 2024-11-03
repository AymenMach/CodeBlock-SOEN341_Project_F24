const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  evaluatedStudent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  evaluator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cooperationScore: { type: Number, required: true, min: 1, max: 5 },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('assessment', assessmentSchema);