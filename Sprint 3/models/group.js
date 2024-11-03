const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  participants: [{ type: String }],
  comments: [{ 
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('groups', groupSchema);