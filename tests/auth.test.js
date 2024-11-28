// testing for authorization
const express = require('express');
const router = require('../routes/auth'); // Import the router
const User = require('../models/User'); // Mock the User model

jest.mock('../models/User'); // Mock the User model

describe('POST /login - User Authentication', () => {
  let app;

  beforeEach(() => {
    // Create an Express app and use the router
    app = express();
    app.use(express.json());
    app.use('/', router);
  });

  it('should return 200 and user details for valid credentials', async () => {
    const mockUser = {
      username: 'testuser',
      password: 'testpassword',
      role: 'student',
      studentId: '12345',
    };

    User.findOne.mockResolvedValue(mockUser);

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

    // Use router.handle to simulate calling the login route
    await router.handle(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.data).toEqual({
      role: 'student',
      username: 'testuser',
      studentId: '12345',
    });
    expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
  });

  it('should return 401 for invalid credentials', async () => {
    User.findOne.mockResolvedValue({
      username: 'testuser',
      password: 'wrongpassword',
    });

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

    await router.handle(req, res);
    expect(res.statusCode).toBe(401);
    expect(res.data).toEqual({ message: 'Invalid credentials' });
  });

  it('should return 500 for server errors', async () => {
    User.findOne.mockRejectedValue(new Error('Database error'));

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

    await router.handle(req, res);
    expect(res.statusCode).toBe(500);
    expect(res.data).toEqual({ message: 'Server error' });
  });
});

