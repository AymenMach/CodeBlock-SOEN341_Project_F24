const fs = require('fs');
const csv = require('csv-parser');
const User = require('../models/User');
const Group = require('../models/Group');

const parseCSVAndStoreData = (csvFilePath) => {
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', async (row) => {
      try {
        let group = await Group.findOne({ name: row.group });
        if (!group && row.group) {
          group = new Group({ name: row.group, students: [] });
          await group.save();
        }

        const user = new User({
          username: row.username,
          password: row.password,
          role: row.role,
          group: row.group || null, 
        });

        await user.save();

        if (row.role === 'student' && group) {
          group.students.push(user);
          await group.save();
        }
      } catch (error) {
        console.error(`Error processing row: ${error}`);
      }
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
};

module.exports = { parseCSVAndStoreData };
