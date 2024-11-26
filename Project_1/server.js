// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { parseCSVAndStoreData } = require('./utils/csvParser');
const groupRoutes = require('./routes/routegroups');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    parseCSVAndStoreData('./data/student.csv'); // Import CSV on initial connection
  })
  .catch(e => console.error('MongoDB connection error:', e));

// Routes
app.use('/api/groups', groupRoutes);
app.use('/api/auth', authRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
