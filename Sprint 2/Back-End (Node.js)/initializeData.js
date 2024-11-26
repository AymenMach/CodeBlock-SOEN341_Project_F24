const fs = require('fs');
const csvParser = require('csv-parser');
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/peerAssessment', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

const importCSV = async (filePath) => {
  const users = [];
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      users.push({ username: row.username, password: row.password, name: row.name, role: row.role,});
    }) .on('end', async () => {
      try {
        await User.insertMany(users);
        console.log('CSV data successfully imported.');
        mongoose.connection.close();
      } catch (error) {
        console.error('Error importing CSV data:', error);
      }
    });
};

importCSV('./data/courseRoster.csv');
