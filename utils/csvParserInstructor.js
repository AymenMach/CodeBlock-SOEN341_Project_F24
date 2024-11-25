const fs = require('fs');
const csv = require('csv-parser');
const User = require('../models/Instructor');

const parseInstructorCSVAndStoreData = (csvFilePath) => {
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', async (row) => {
      const { username, password, name, role } = row;

      if (!username || !password || !role) {
        if (!username) console.log("Username not found");
        if (!password) console.log("Password not found");
        if (!role) console.log("Role not found");
        console.log("Missing user element");
        return;
      }

      if (role !== 'instructor') {
        console.log(`Invalid role for user ${username}: ${role}`);
        return;
      }

      try {
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
          const newUser = new User({        
            username,
            password,
            name,
            role
          });
          await newUser.save();
          console.log(`Inserted instructor ${username}`);
        } else {
          console.log(`Instructor ${username} already exists`);
        }
      } catch (error) {
        console.error('Error saving instructor:', error);
      }
    })
    .on('end', () => console.log('Instructor CSV file processed successfully'));
};

module.exports = { parseInstructorCSVAndStoreData };
