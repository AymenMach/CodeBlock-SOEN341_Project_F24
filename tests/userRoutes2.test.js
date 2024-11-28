// testing for router.get submission
const User = require('../models/newUser'); // Mock the User model

jest.mock('../models/newUser'); // Mock the User model

describe('GET / - Fetch Users', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test
  });

  it('should successfully fetch all users', async () => {
    const req = {}; // No body needed for GET request

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

    const mockUsers = [
      { _id: '1', username: 'user1', role: 'admin' },
      { _id: '2', username: 'user2', role: 'student' },
    ];

    User.find.mockResolvedValue(mockUsers); // Mock User.find to return mockUsers

    const getUsers = async (req, res) => {
      try {
        const users = await User.find();
        res.status(200).json(users);
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
      }
    };

    await getUsers(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.data).toEqual(mockUsers);
    expect(User.find).toHaveBeenCalledTimes(1);
  });

  it('should handle server errors', async () => {
    const req = {}; // No body needed for GET request

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

    User.find.mockRejectedValue(new Error('Database error')); // Simulate a database error

    const getUsers = async (req, res) => {
      try {
        const users = await User.find();
        res.status(200).json(users);
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
      }
    };

    await getUsers(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.data).toEqual({ message: 'Failed to fetch users' });
    expect(User.find).toHaveBeenCalledTimes(1);
  });
});

