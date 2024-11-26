const mongoose = require('mongoose');

// Define User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  studentID: { type: String, required: true, unique: true },
  role: { type: String, required: true, enum: ['student', 'instructor'] },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
