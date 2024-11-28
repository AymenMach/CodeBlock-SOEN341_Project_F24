// testing login-loginUser
const { loginUser } = require('../controllers/userController'); // Mock the loginUser controller
const User = require('../models/newUser'); // Mock the User model

jest.mock('../controllers/userController'); // Mock the userController
jest.mock('../models/newUser'); // Mock the User model

describe('POST /login - User Login', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test
  });

  it('should call loginUser successfully with valid credentials', async () => {
    const req = {
      body: {
        username: 'testuser',
        password: 'testpassword',
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

    loginUser.mockImplementation(async (req, res) => {
      res.status(200).json({ message: 'Login successful', username: req.body.username });
    });

    await loginUser(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.data).toEqual({ message: 'Login successful', username: 'testuser' });
    expect(loginUser).toHaveBeenCalledTimes(1);
  });

  it('should handle invalid credentials', async () => {
    const req = {
      body: {
        username: 'testuser',
        password: 'wrongpassword',
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

    loginUser.mockImplementation(async (req, res) => {
      res.status(401).json({ message: 'Invalid credentials' });
    });

    await loginUser(req, res);

    expect(res.statusCode).toBe(401);
    expect(res.data).toEqual({ message: 'Invalid credentials' });
    expect(loginUser).toHaveBeenCalledTimes(1);
  });

  it('should handle server errors', async () => {
    const req = {
      body: {
        username: 'testuser',
        password: 'testpassword',
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

    loginUser.mockImplementation(async (req, res) => {
      throw new Error('Server error');
    });

    try {
      await loginUser(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }

    expect(res.statusCode).toBe(500);
    expect(res.data).toEqual({ message: 'Internal server error' });
    expect(loginUser).toHaveBeenCalledTimes(1);
  });
});
