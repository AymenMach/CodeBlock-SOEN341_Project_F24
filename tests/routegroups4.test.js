// Testing Assign students to a group
const Group = require('../models/group'); // Mock the Group model
const User = require('../models/user'); // Mock the User model

jest.mock('../models/group'); // Mock the Group model
jest.mock('../models/user'); // Mock the User model

describe('POST /assign - Assign Students to a Group', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test
  });

  it('should assign students to a group successfully', async () => {
    const req = {
      body: {
        groupId: '12345',
        studentIds: ['101', '102'],
      },
    }; // Mock the request object

    const res = {
      statusCode: 0,
      data: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.data = payload;
      },
    };

    const mockGroup = {
      _id: '12345',
      name: 'Group 1',
      students: [],
      save: jest.fn().mockResolvedValue(true),
    };

    const mockStudents = [
      { studentId: '101', role: 'student' },
      { studentId: '102', role: 'student' },
    ];

    Group.findById.mockResolvedValue(mockGroup); // Mock finding the group
    User.find.mockResolvedValue(mockStudents); // Mock finding the students

    const assignStudentsToGroup = async (req, res) => {
      const { groupId, studentIds } = req.body;

      try {
        const group = await Group.findById(groupId);
        if (!group) {
          return res.status(404).json({ message: 'Group not found' });
        }

        const students = await User.find({ studentId: { $in: studentIds }, role: 'student' });
        if (students.length !== studentIds.length) {
          return res.status(400).json({ message: 'Some students not found' });
        }

        group.students.push(...students.map(student => student.studentId));
        await group.save();
        res.status(200).json(group);
      } catch (error) {
        console.error('Error assigning students:', error);
        res.status(500).json({ message: 'Error assigning students' });
      }
    };

    await assignStudentsToGroup(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.data).toEqual(mockGroup);
    expect(Group.findById).toHaveBeenCalledWith('12345');
    expect(User.find).toHaveBeenCalledWith({ studentId: { $in: ['101', '102'] }, role: 'student' });
    expect(mockGroup.save).toHaveBeenCalledTimes(1);
  });

  it('should return 404 if the group is not found', async () => {
    Group.findById.mockResolvedValue(null); // Mock finding no group

    const req = {
      body: {
        groupId: 'invalidGroupId',
        studentIds: ['101', '102'],
      },
    }; // Mock the request object

    const res = {
      statusCode: 0,
      data: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.data = payload;
      },
    };

    const assignStudentsToGroup = async (req, res) => {
      const { groupId, studentIds } = req.body;

      try {
        const group = await Group.findById(groupId);
        if (!group) {
          return res.status(404).json({ message: 'Group not found' });
        }

        const students = await User.find({ studentId: { $in: studentIds }, role: 'student' });
        if (students.length !== studentIds.length) {
          return res.status(400).json({ message: 'Some students not found' });
        }

        group.students.push(...students.map(student => student.studentId));
        await group.save();
        res.status(200).json(group);
      } catch (error) {
        console.error('Error assigning students:', error);
        res.status(500).json({ message: 'Error assigning students' });
      }
    };

    await assignStudentsToGroup(req, res);

    expect(r

