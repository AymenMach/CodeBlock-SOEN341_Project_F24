const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'student' },
  studentId: { type: Number, required: true }, 
  belongsToGroup: { type: String }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
