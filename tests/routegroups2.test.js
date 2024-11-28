// Testing for routing to get participants by group ID
const Group = require('../models/group'); // Mock the Group model

jest.mock('../models/group'); // Mock the Group model

describe('GET /:groupId/participants - Fetch Participants by Group ID', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test
  });

  it('should return participants for a valid group ID', async () => {
    const mockGroup = {
      _id: '12345',
      name: 'Group 1',
      participants: ['User1', 'User2', 'User3'],
    };

    Group.findById.mockResolvedValue(mockGroup); // Mock the database call

    const req = {
      params: {
        groupId: '12345',
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

    const getParticipantsByGroupId = async (req, res) => {
      const { groupId } = req.params;
      try {
        const group = await Group.findById(groupId);
        if (!group) {
          return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json(group.participants);
      } catch (error) {
        console.error('Error fetching participants:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };

    await getParticipantsByGroupId(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.data).toEqual(mockGroup.participants);
    expect(Group.findById).toHaveBeenCalledWith('12345');
    expect(Group.findById).toHaveBeenCalledTimes(1);
  });

  it('should return 404 if the group is not found', async () => {
    Group.findById.mockResolvedValue(null); // Mock the database call to return no group

    const req = {
      params: {
        groupId: 'invalidGroupId',
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

    const getParticipantsByGroupId = async (req, res) => {
      const { groupId } = req.params;
      try {
        const group = await Group.findById(groupId);
        if (!group) {
          return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json(group.participants);
      } catch (error) {
        console.error('Error fetching participants:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };

    await getParticipantsByGroupId(req, res);

    expect(res.statusCode).toBe(404);
    expect(res.data).toEqual({ message: 'Group not found' });
    expect(Group.findById).toHaveBeenCalledWith('invalidGroupId');
    expect(Group.findById).toHaveBeenCalledTimes(1);
  });

  it('should return 500 if an error occurs', async () => {
    Group.findById.mockRejectedValue(new Error('Database error')); // Mock the database call to throw an error

    const req = {
      params: {
        groupId: '12345',
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

    const getParticipantsByGroupId = async (req, res) => {
      const { groupId } = req.params;
      try {
        const group = await Group.findById(groupId);
        if (!group) {
          return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json(group.participants);
      } catch (error) {
        console.error('Error fetching participants:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };

    await getParticipantsByGroupId(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.data).toEqual({ message: 'Internal server error' });
    expect(Group.findById).toHaveBeenCalledWith('12345');
    expect(Group.findById).toHaveBeenCalledTimes(1);
  });
});
