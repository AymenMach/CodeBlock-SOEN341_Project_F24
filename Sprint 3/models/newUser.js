const mongoose = require('mongoose');

// Create User collection in MongoDB
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'student' },
  belongsToGroup: { type: String } 
});


// Ensure the model is only created once
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
