const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


// Create User collection in MongoDB
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: {type: String, required: true},
  role: { type: String, enum: ['student', 'instructor'], required: true },
  belongsToGroup: {type: String}
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    //this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Ensure the model is only created once
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;