const Instructor = require('../models/Instructor'); // Importing the Instructor model

const loginInstructor = async (req, res) => {
  const { username, password } = req.body;

  try {
    const instructor = await Instructor.findOne({ username });
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    if (instructor.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    return res.status(200).json({ message: 'Login successful', instructor });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Error logging in instructor' });
  }
};

// This function handles the login process for an instructor. It checks if the instructor exists and if the provided password is correct. If successful, it returns the instructor's details; otherwise, it returns appropriate error messages.
module.exports = {
  loginInstructor,
};

