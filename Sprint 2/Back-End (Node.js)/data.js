const fs = require('fs');
const csvParser = require('csv-parser');
const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/peerAssessment', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Import CSV data into MongoDB for testing purposes
const importCSV = async (filePath) => {
  const users = [];
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      users.push({
        username: row.username,
        password: row.password,
        role: 'student',  // Set the role for imported users as "student"
      });
    })
    .on('end', async () => {
      try {
        await User.insertMany(users);
        console.log('CSV data successfully imported.');
        mongoose.connection.close();
      } catch (error) {
        console.error('Error importing CSV data:', error);
      }
    });
};

// Call this function with the path to the CSV file in the data folder
importCSV('./data/courseRoster.csv');
