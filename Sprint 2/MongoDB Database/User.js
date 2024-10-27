const mongoose = require('mongoose');

// Define User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['student', 'instructor'] }, // Restrict role to either 'student' or 'instructor'
});

// Compile model from schema
const User = mongoose.model('User', userSchema);

module.exports = User;

// Pre-set login credentials
const initializeUsers = async () => {
  try {
    // Define initial users
    const initialUsers = [
      { username: 'Aymen', password: '40250403', role: 'instructor' },
      { username: 'Nihal', password: '40250403', role: 'student' },
    ];

    // Check if users already exist
    const existingUsers = await User.find({});
    if (existingUsers.length === 0) {
      await User.insertMany(initialUsers);
      console.log('Pre-set users have been added.');
    } else {
      console.log('Users already initialized.');
    }
  } catch (error) {
    console.error('Error initializing users:', error);
  }
};

initializeUsers();

