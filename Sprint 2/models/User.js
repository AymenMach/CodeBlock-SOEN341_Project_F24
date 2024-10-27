const mongoose = require('mongoose');

// Define User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['student', 'instructor'] },
});

// Compile model from schema
const User = mongoose.model('User', userSchema);
module.exports = User;
