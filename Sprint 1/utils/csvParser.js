// csvParser.js
const fs = require('fs');
const csv = require('csv-parser');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const parseCSVAndStoreData = (csvFilePath) => {
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', async (row) => {
      const { username, password, name, role } = row;
      if (!username || !password || !name || !role) {

        if(!name)
        {
          console.log("Name not found");
        }

        if(!role)
          {
            console.log("Name not found");
          }
      
          if(!username)
            {
              console.log("Name not found");
            }

            if(!password)
              {
                console.log("Name not found");
              }
        console.log("Missing user element");
        return;
      }

      try {
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
          //const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = new User({ username, password, name, role });
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
