// testing for authorization
const httpMocks = require('node-mocks-http');
const { post } = require('../auth'); // Import the POST route handler
const User = require('../models/User'); // Import the User model

jest.mock('../models/User'); // Mock the User model

describe('POST /login - User Authentication', () => {
  it('should return 200 and user details for valid credentials', async () => {
    // Mock valid user data
    const mockUser = {
      username: 'testuser',
      password: 'testpassword',
      role: 'student',
      studentId: '12345',
    };

    User.findOne.mockResolvedValue(mockUser);

    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/login',
      body: {
        username: 'testuser',
        password: 'testpassword',
      },
    });
    const res = httpMocks.createResponse();

    // Call the route handler
    await post(req, res);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
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

    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/login',
      body: {
        username: 'testuser',
        password: 'testpassword',
      },
    });
    const res = httpMocks.createResponse();

    await post(req, res);

    expect(res.statusCode).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Invalid credentials' });
  });

  it('should return 500 for server errors', async () => {
    User.findOne.mockRejectedValue(new Error('Database error'));

    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/login',
      body: {
        username: 'testuser',
        password: 'testpassword',
      },
    });
    const res = httpMocks.createResponse();

    await post(req, res);

    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Server error' });
  });
});
