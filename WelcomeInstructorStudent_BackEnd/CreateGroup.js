const group = require('group');
const user = require('user');

const create = async (req, res) => {
  const {groupname} = req.body;
  try {
    const group = new Group({name: groupname}); 
    await group.save();
    res.status(201).json(group_;
  }
  catch (error) {
    res.status(500).json({message: 'Error group creation'});
  }
};

const assignStudent = async (req, body) => {
  const {groupID, studentID } req.body;
  try {
    const group = await Group.findByID(groupID);
    const student = await User.findByID(studentID);
    group.students.push(student);
    await group.save();
    res.status(200).json(group);
  }
  catch (error) {
    res.status(500).json({message: 'Error assign student'});
  }
};

module.exports = {create, assignStudent};
