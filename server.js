const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const groupRoutes = require('./routes/routegroups');
const userRoutes = require('./routes/userRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const { parseCSVAndStoreData } = require('./utils/csvParser');
const instructorRoutes = require('./routes/instructorRoutes');
const settingRoutes = require('./routes/settingsRoutes');
const { parseInstructorCSVAndStoreData } = require('./utils/csvParserInstructor');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/instructors', instructorRoutes);
app.use(settingRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/users', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/assessments', assessmentRoutes);


const importCSV = async () => {
  const csvFilePath = './data/roster.csv';
  const instructorCsvFilePath = './data/instructor.csv';
  try {
    await parseCSVAndStoreData(csvFilePath);
    await parseInstructorCSVAndStoreData(instructorCsvFilePath);
  } catch (error) {
    console.error('Error importing CSV:', error);
  }
};

importCSV();

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
