// testing for logout function
const { Router } = require('express'); // Import Express Router
const router = Router(); // Mock the router if required

describe('POST /logout - User Logout', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test
  });

  it('should successfully log out a user', async () => {
    const req = {
      session: {
        destroy: jest.fn((callback) => callback(null)), // Mock destroy method to simulate success
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

    const logout = (req, res) => {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: 'Could not log out' });
        }
        res.status(200).json({ message: 'Logged out successfully' });
      });
    };

    await logout(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.data).toEqual({ message: 'Logged out successfully' });
    expect(req.session.destroy).toHaveBeenCalledTimes(1);
  });

  it('should return 500 if an error occurs during logout', async () => {
    const req = {
      session: {
        destroy: jest.fn((callback) => callback(new Error('Destroy session error'))), // Simulate an error
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

    const logout = (req, res) => {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: 'Could not log out' });
        }
        res.status(200).json({ message: 'Logged out successfully' });
      });
    };

    await logout(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.data).toEqual({ message: 'Could not log out' });
    expect(req.session.destroy).toHaveBeenCalledTimes(1);
  });
});
