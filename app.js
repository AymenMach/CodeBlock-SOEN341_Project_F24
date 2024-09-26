const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user');
const bcrypt = require('bcrypt');

app.use(express.json());

// Start the server
app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});

app.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = await User.findOne({username, role});
    
    if (!user) {
      user = new User({ username, password, role });
      await user.save();
      return res.status(201).json({ message: 'Account Created Successfully for ${username} as ${role}'});
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(401).json({ error: 'Invalid username or password'});
  }
    res.status(200).json({ message: 'Logged In as ${user.username}', username: user.username, role: user.role }); 
} 
  catch (error) {
console.error('Logging In Error', error);
  res.status(500).json({ error: 'Error occured while logging in' });
}
});
  
