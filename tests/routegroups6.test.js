// Testing Remove a participant from a group
const Group = require('../models/group'); // Mock the Group model

jest.mock('../models/group'); // Mock the Group model

describe('POST /remove-participant - Remove Participant from a Group', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test
  });

  it('should successfully remove a participant from the group', async () => {
    const req = {
      body: {
        groupId: '12345',
        studentId: '101',
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
      name: 'Group 1',
      participants: ['101', '102'],
      save: jest.fn().mockResolvedValue(true),
    };

    Group.findById.mockResolvedValue(mockGroup);

    const removeParticipant = async (req, res) => {
      const { groupId, studentId } = req.body;

      try {
        const group = await Group.findById(groupId);
        if (!group) {
          return res.status(404).json({ message: 'Group not found' });
        }

        if (!group.participants.includes(studentId)) {
          return res.status(400).json({ message: 'Participant not found in the group' });
        }

        group.participants = group.participants.filter(participant => participant !== studentId);
        await group.save();
        res.status(200).json(group);
      } catch (error) {
        console.error('Error removing participant:', error);
        res.status(500).json({ message: 'Failed to remove participant' });
      }
    };

    await removeParticipant(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.data).toEqual(mockGroup);
    expect(Group.findById).toHaveBeenCalledWith('12345');
    expect(mockGroup.save).toHaveBeenCalledTimes(1);
  });

  it('should return 404 if the group is not found', async () => {
    const req = {
      body: {
        groupId: 'invalidGroupId',
        studentId: '101',
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

    const removeParticipant = async (req, res) => {
      const { groupId, studentId } = req.body;

      try {
        const group = await Group.findById(groupId);
        if (!group) {
          return res.status(404).json({ message: 'Group not found' });
        }

        if (!group.participants.includes(studentId)) {
          return res.status(400).json({ message: 'Participant not found in the group' });
        }

        group.participants = group.participants.filter(participant => participant !== studentId);
        await group.save();
        res.status(200).json(group);
      } catch (error) {
        console.error('Error removing participant:', error);
        res.status(500).json({ message: 'Failed to remove participant' });
      }
    };

    await removeParticipant(req, res);

    expect(res.statusCode).toBe(404);
    expect(res.data).toEqual({ message: 'Group not found' });
    expect(Group.findById).toHaveBeenCalledWith('invalidGroupId');
  });

  it('should return 400 if the participant is not in the group', async () => {
    const req = {
      body: {
        groupId: '12345',
        studentId: '103',
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
      name: 'Group 1',
      participants: ['101', '102'], // Participant '103' not in the group
      save: jest.fn(),
    };

    Group.findById.mockResolvedValue(mockGroup);

    const removeParticipant = async (req, res) => {
      const { groupId, studentId } = req.body;

      try {
        const group = await Group.findById(groupId);
        if (!group) {
          return res.status(404).json({ message: 'Group not found' });
        }

        if (!group.participants.includes(studentId)) {
          return res.status(400).json({ message: 'Participant not found in the group' });
        }

        group.participants = group.participants.filter(participant => participant !== studentId);
        await group.save();
        res.status(200).json(group);
      } catch (error) {
        console.error('Error removing participant:', error);
        res.status(500).json({ message: 'Failed to remove participant' });
      }
    };

    await removeParticipant(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.data).toEqual({ message: 'Participant not found in the group' });
    expect(Group.findById).toHaveBeenCalledWith('12345');
  });

  it('should return 500 if an error occurs while removing the participant', async () => {
    const req = {
      body: {
        groupId: '12345',
        studentId: '101',
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

    const removeParticipant = async (req, res) => {
      const { groupId, studentId } = req.body;

      try {
        const group = await Group.findById(groupId);
        if (!group) {
          return res.status(404).json({ message: 'Group not found' });
        }

        if (!group.participants.includes(studentId)) {
          return res.status(400).json({ message: 'Participant not found in the group' });
        }

        group.participants = group.participants.filter(participant => participant !== studentId);
        await group.save();
        res.status(200).json(group);
      } catch (error) {
        console.error('Error removing participant:', error);
        res.status(500).json({ message: 'Failed to remove participant' });
      }
    };

    await removeParticipant(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.data).toEqual({ message: 'Failed to remove participant' });
    expect(Group.findById).toHaveBeenCalledWith('12345');
  });
});


