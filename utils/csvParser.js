const fs = require('fs');
const csv = require('csv-parser');
const User = require('../models/User');

const parseCSVAndStoreData = (csvFilePath) => {
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', async (row) => {
      const { username, password, name, role, studentId } = row;

      if (!username || !password || !name || !role || !studentId) {
        if (!username) console.log("Username not found");
        if (!password) console.log("Password not found");
        if (!name) console.log("Name not found");
        if (!role) console.log("Role not found");
        if (!studentId) console.log("Student ID not found");
        console.log("Missing user element");
        return;
      }

      if (role !== 'student') {
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
            role,
            studentId: String(studentId)
          });
          await newUser.save();
          console.log(`Inserted user ${username}`);
        } else {
          console.log(`User ${username} already exists`);
        }
      } catch (error) {
        console.error('Error saving user:', error);
      }
    })
    .on('end', () => console.log('CSV file processed successfully'));
};

module.exports = { parseCSVAndStoreData };
