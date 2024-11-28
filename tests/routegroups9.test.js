// Testing Get group members
const Group = require('../models/group'); // Mock the Group model

jest.mock('../models/group'); // Mock the Group model

describe('GET /:groupId/members - Get Group Members', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test
  });

  it('should successfully return group members', async () => {
    const req = {
      params: {
        groupId: '12345',
      },
    };

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
      name: 'Test Group',
      students: ['Student1', 'Student2'], // Mocked student data
      populate: jest.fn().mockResolvedValue({
        _id: '12345',
        name: 'Test Group',
        students: ['Student1', 'Student2'],
      }), // Mock populate method
    };

    Group.findById.mockResolvedValue(mockGroup);

    const getGroupMembers = async (req, res) => {
      const { groupId } = req.params;

      try {
        const group = await Group.findById(groupId).populate('students');
        if (!group) {
          return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json(group.students);
      } catch (error) {
        console.error('Error fetching group members:', error);
        res.status(500).json({ message: 'Failed to fetch group members' });
      }
    };

    await getGroupMembers(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.data).toEqual(['Student1', 'Student2']);
    expect(Group.findById).toHaveBeenCalledWith('12345');
    expect(mockGroup.populate).toHaveBeenCalledWith('students');
  });

  it('should return 404 if the group is not found', async () => {
    const req = {
      params: {
        groupId: 'invalidGroupId',
      },
    };

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

    Group.findById.mockResolvedValue(null); // Simulate no group found

    const getGroupMembers = async (req, res) => {
      const { groupId } = req.params;

      try {
        const group = await Group.findById(groupId).populate('students');
        if (!group) {
          return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json(group.students);
      } catch (error) {
        console.error('Error fetching group members:', error);
        res.status(500).json({ message: 'Failed to fetch group members' });
      }
    };

    await getGroupMembers(req, res);

    expect(res.statusCode).toBe(404);
    expect(res.data).toEqual({ message: 'Group not found' });
    expect(Group.findById).toHaveBeenCalledWith('invalidGroupId');
  });

  it('should return 500 if an error occurs while fetching group members', async () => {
    const req = {
      params: {
        groupId: '12345',
      },
    };

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

    Group.findById.mockRejectedValue(new Error('Database error')); // Simulate a database error

    const getGroupMembers = async (req, res) => {
      const { groupId } = req.params;

      try {
        const group = await Group.findById(groupId).populate('students');
        if (!group) {
          return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json(group.students);
      } catch (error) {
        console.error('Error fetching group members:', error);
        res.status(500).json({ message: 'Failed to fetch group members' });
      }
    };

    await getGroupMembers(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.data).toEqual({ message: 'Failed to fetch group members' });
    expect(Group.findById).toHaveBeenCalledWith('12345');
  });
});

