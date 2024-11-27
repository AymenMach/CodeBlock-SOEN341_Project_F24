const assignStudent = async (req, res) => {
  const { groupID, studentID } = req.body;

  console.log('Assigning student:', { groupID, studentID });

  try {
    console.log('Finding group...');
    const group = await Group.findById(groupID);
    console.log('Group found:', group);

    console.log('Finding student...');
    const student = await User.findById(studentID);
    console.log('Student found:', student);

    if (!group || !student) {
      console.log('Group or student not found');
      return res.status(404).json({ message: 'Group or student not found' });
    }

    if (group.students.includes(studentID)) {
      console.log('Student already in group');
      return res.status(400).json({ message: 'Student already in group' });
    }

    console.log('Adding student to group...');
    group.students.push(studentID);

    console.log('Saving group...');
    await group.save();
    console.log('Group saved successfully');

    console.log('Populating updated group...');
    const updatedGroup = await Group.findById(groupID).populate('students', 'username');
    console.log('Updated group populated:', updatedGroup);

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error('Error during assignStudent:', error);
    res.status(500).json({ message: 'Error assigning student' });
  }
};
