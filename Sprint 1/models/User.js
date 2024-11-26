const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'instructor'], required: true }, // Role is required
  group: { type: String } // Group is optional, for example, instructors might not belong to a group
});

module.exports = mongoose.model('User', userSchema);