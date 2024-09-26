const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/login', {
  userNewUrlParser: true, 
  useUnifiedTopology: true, 
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.log('Failed to Connect to MongoDB', error));
                      
