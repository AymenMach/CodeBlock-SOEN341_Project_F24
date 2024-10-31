const fs = require('fs');
const csv = require('csv-parser');
const User = require('../models/User');

const parseCSVAndStoreData = async (csvFilePath) => {
  try {
    const users = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', async (row) => {
        const { username, password, role, group } = row;

        // Validate that all required fields are present
        if (!username || !password || !role) {
          console.error('Error processing row:', row);
          return;
        }

        // Check if the user already exists before inserting
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          console.log('User ${username} already exists, skipping.');
        } else {
          const newUser = new User({
            username,
            password,
            role, // Ensure role is saved
            group // Ensure group is saved
          });

          await newUser.save();
          console.log('Inserted user ${username}');
        }
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
      });
  } catch (error) {
    console.error('Error processing CSV file:', error);
  }
};

module.exports = { parseCSVAndStoreData };

