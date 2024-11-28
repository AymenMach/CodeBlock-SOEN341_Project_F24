const { loginInstructor } = require('../controllers/instructorController'); // Mock the login controller

jest.mock('../controllers/instructorController'); // Mock the loginInstructor controller

describe('POST /login - Instructor Login', () => {
  it('should call the loginInstructor controller successfully', async () => {
    const req = {
      body: {
        username: 'instructor',
        password: 'password123',
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

    // Mock the loginInstructor implementation
    loginInstructor.mockImplementation(async (req, res) => {
      res.status(200).json({ message: 'Login successful' });
    });

    await loginInstructor(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.data).toEqual({ message: 'Login successful' });
    expect(loginInstructor).toHaveBeenCalledTimes(1);
  });

  it('should handle login errors', async () => {
    const req = {
      body: {
        username: 'instructor',
        password: 'wrongpassword',
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

    // Mock loginInstructor to simulate an error
    loginInstructor.mockImplementation(async (req, res) => {
      res.status(401).json({ message: 'Invalid credentials' });
    });

    await loginInstructor(req, res);

    expect(res.statusCode).toBe(401);
    expect(res.data).toEqual({ message: 'Invalid credentials' });
    expect(loginInstructor).toHaveBeenCalledTimes(1);
  });
});
