const fs = require('fs');
const csv = require('csv-parser');
const User = require('../models/User');
const Group = require('../models/Group');

const parseCSVAndStoreData = (csvFilePath) => {
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', async (row) => {
      try {
        // Validate row: Check if required fields (username, password, role) exist
        if (!row.username || !row.password || !row.role) {
          console.error(`Error: Missing required field in row: ${JSON.stringify(row)}`);
          return; // Skip this row if required fields are missing
        }

        // Check if the user already exists to avoid duplicates
        const existingUser = await User.findOne({ username: row.username });
        if (existingUser) {
          console.log(`User with username ${row.username} already exists. Skipping.`);
          return; // Skip this row if the user already exists
        }

        // Check if the group exists or create a new group
        let group = null;
        if (row.group) {
          group = await Group.findOne({ name: row.group });
          if (!group) {
            group = new Group({ name: row.group, students: [] });
            await group.save(); // Save the new group
            console.log(`Created new group: ${row.group}`);
          }
        }

        // Create a new user
        const user = new User({
          username: row.username,
          password: row.password,
          role: row.role,
          group: row.group || null, // Assign the group if present
        });

        await user.save(); // Save the user in the database
        console.log(`Created new user: ${row.username}`);

        // If the user is a student and a group exists, add the student to the group
        if (row.role === 'student' && group) {
          group.students.push(user); // Add the student to the group's student list
          await group.save(); // Save the updated group
          console.log(`Added ${row.username} to group ${group.name}`);
        }
      } catch (error) {
        console.error(`Error processing row: ${error}`);
      }
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
};

module.exports = {parseCSVAndStoreData};
