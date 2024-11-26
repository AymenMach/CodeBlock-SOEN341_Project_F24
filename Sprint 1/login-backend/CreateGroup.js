const Group = require('../models/Group');
const User = require('../models/User');

const createGroup = async (req, res) => {
  const { groupName } = req.body;
  try {
    const group = new Group({ name: groupName });
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error creating group' });
  }
};

const assignStudent = async (req, res) => { 
  const { groupID, studentID } = req.body;
  try {
    const group = await Group.findById(groupID); 
    const student = await User.findById(studentID); 

    if (!group || !student) {
      return res.status(404).json({ message: 'Group or student not found' });
    }

    group.students.push(student);
    await group.save();

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error assigning student' });
  }
};

module.exports = { createGroup, assignStudent };