const mongoose = require('mongoose');

// Define Group schema
const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of references to User documents
});

// Compile model from schema
const Group = mongoose.model('Group', groupSchema);

module.exports = Group;

// Pre-set groups and participants
const initializeGroups = async () => {
  try {
    const initialGroups = [
      {
        name: 'Group A',
        participants: [], 
      },
      {
        name: 'Group B',
        participants: [],
      },
    ];

    // Check if groups already exist
    const existingGroups = await Group.find({});
    if (existingGroups.length === 0) {
      await Group.insertMany(initialGroups);
      console.log('Pre-set groups have been added.');
    } else {
      console.log('Groups already initialized.');
    }
  } catch (error) {
    console.error('Error initializing groups:', error);
  }
};

initializeGroups();

