// testing fetching all groups 
const Group = require('../models/group'); // Mock the Group model

jest.mock('../models/group'); // Mock the Group model

describe('GET / - Fetch Groups', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test
  });

  it('should return a list of groups', async () => {
    const mockGroups = [
      { name: 'Group 1', members: ['User1', 'User2'] },
      { name: 'Group 2', members: ['User3', 'User4'] },
    ];

    Group.find.mockResolvedValue(mockGroups); // Mock the database call

    const req = {}; // Mock the request object
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

    const getGroups = async (req, res) => {
      try {
        const groups = await Group.find();
        res.status(200).json(groups);
      } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ message: 'Error fetching groups' });
      }
    };

    await getGroups(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.data).toEqual(mockGroups);
    expect(Group.find).toHaveBeenCalledTimes(1);
  });

  it('should return 500 if an error occurs', async () => {
    Group.find.mockRejectedValue(new Error('Database error')); // Mock the database call to throw an error

    const req = {}; // Mock the request object
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

    const getGroups = async (req, res) => {
      try {
        const groups = await Group.find();
        res.status(200).json(groups);
      } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ message: 'Error fetching groups' });
      }
    };

    await getGroups(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.data).toEqual({ message: 'Error fetching groups' });
    expect(Group.find).toHaveBeenCalledTimes(1);
  });
});
