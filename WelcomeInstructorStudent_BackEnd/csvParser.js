const fs = require('fs');
const csv = require('csv-parser');
const User = require('../models/User');
const Group = require('../models/Group');

const parseCSVAndStoreData = async (csvFilePath) => {
  try {
    const users = [];
    const groups = {};
    
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', async (row) => {
        const { username, password, role, group } = row;
        const user = new User({ username, password, role, group });
        users.push(user);
        await user.save();
        
        if (role === 'student') {
          if (!groups[group]) {
            const newGroup = new Group({ name: group, students: [] });
            groups[group] = newGroup;
            await newGroup.save();
          }

          groups[group].students.push(user._id); 
          await groups[group].save();
        }
      })
      .on('end', () => {
        console.log('CSV file successfully processed and stored in MongoDB');
      });
  } 
  catch (error) {
    console.error('Error processing CSV file:', error);
  }
};

module.exports = { parseCSVAndStoreData };
