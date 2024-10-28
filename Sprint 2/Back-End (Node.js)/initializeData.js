const fs = require('fs');
const csvParser = require('csv-parser');
const mongoose = require('mongoose');
const user = require('./models/user');

mongoose.connect('mongodb://localhost:27017/peerAssessment', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

// Import CSV data into MongoDB
const importCSV = async (filePath) => {
  const users = [];
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      const user = {
        username: row.username,
        password: row.password,
        name: row.name,
        role: row.role,
      };

      if (row.role === 'student') {
        user.studentID = generateStudentID().toString();
      }

      users.push(user);
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

importCSV('./data/courseRoster.csv');
