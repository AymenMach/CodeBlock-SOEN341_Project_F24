const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/peerAssessment', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/groups', require('./routes/groupRoutes'));

// Set up routes
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(5000, () => console.log('Server running on port 5000'));



