const User = require('../models/User'); 

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.status(200).json({ role: user.role, username: user.username });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { loginUser }; 