const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth'); // Import auth routes
const cors = require('cors');
const bodyParser = require('body-parser');
const groupRoutes = require('./routes/routegroups'); 
const userRoutes = require('./routes/userRoutes'); 
const {parseCSVAndStoreData} = require('./utils/csvParser');

require('dotenv').config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const importCSV = async () => {
  const csvFilePath = './data/roster.csv'; 
  parseCSVAndStoreData(csvFilePath);
};


importCSV();

// Routes
app.use('/api/groups', groupRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/users', authRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});