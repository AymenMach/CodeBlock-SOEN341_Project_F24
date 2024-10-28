const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');
const cors = require('cors'); 
const app = express();
app.use(express.json());
app.use(cors()); 

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/peerAssessment', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Set up routes
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port 5000`));
