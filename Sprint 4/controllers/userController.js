const User = require('../models/User');
const Instructor = require('../models/Instructor');

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
console.log('Student found:', user);

if (!user) {
  user = await Instructor.findOne({ username });
  console.log('Instructor found:', user);
}

   
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  
    return res.status(200).json({
      role: user.role,
      username: user.username,
      _id: user._id, 
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { loginUser };
