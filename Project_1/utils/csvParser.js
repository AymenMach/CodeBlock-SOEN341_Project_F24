// csvParser.js
const fs = require('fs');
const csv = require('csv-parser');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const parseCSVAndStoreData = (csvFilePath) => {
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', async (row) => {
      const { username, password, role, group } = row;

      if (!username || !password || !role) {
        console.error('Error: Missing fields in row:', row);
        return;
      }

      try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          console.log(`User ${username} already exists, skipping.`);
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = new User({
            username,
            password: hashedPassword,
            role,
            group
          });
          await newUser.save();
          console.log(`Inserted user ${username}`);
        }
      } catch (error) {
        console.error('Error saving user:', error);
      }
    })
    .on('end', () => console.log('CSV file processed successfully'));
};

module.exports = { parseCSVAndStoreData };
