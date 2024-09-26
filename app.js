const express = require('express');
const app = express();
const User = require('./models/user');
const bcrypt = require('bcrypt');

app.use(express.json());

// Start the server
app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({username});
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password'});
    }
  }};
} catch (error) {
console.error('Logging In Error', error);
  res.status(5000).json({ error: 'Error occured while logging in' });
}
});
  
