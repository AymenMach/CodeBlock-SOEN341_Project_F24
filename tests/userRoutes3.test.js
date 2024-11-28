// Registration endpoint
const User = require('../models/newUser'); // Mock the User model

jest.mock('../models/newUser'); // Mock the User model

describe('POST / - Register User', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test
  });

  it('should successfully register a user', async () => {
    const req = {
      body: {
        fullName: 'John Doe',
        username: 'johndoe',
        password: 'securepassword',
        studentId: '12345',
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

    const mockUser = {
      _id: '1',
      name: 'John Doe',
      username: 'johndoe',
      password: 'securepassword',
      studentId: '12345',
      role: 'student',
    };

    User.prototype.save = jest.fn().mockResolvedValue(mockUser); // Mock save method

    const registerUser = async (req, res) => {
      const { fullName, username, password, studentId } = req.body;

      try {
        const newUser = new User({
          name: fullName,
          username,
          password,
          studentId,
          role: 'student',
        });

        await newUser.save();
        return res.status(201).json({ message: 'User registered successfully!' });
      } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Error registering user' });
      }
    };

    await registerUser(req, res);

    expect(res.statusCode).toBe(201);
    expect(res.data).toEqual({ message: 'User registered successfully!' });
    expect(User.prototype.save).toHaveBeenCalledTimes(1);
  });

  it('should return 500 if an error occurs during registration', async () => {
    const req = {
      body: {
        fullName: 'John Doe',
        username: 'johndoe',
        password: 'securepassword',
        studentId: '12345',
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

    User.prototype.save = jest.fn().mockRejectedValue(new Error('Database error')); // Simulate a database error

    const registerUser = async (req, res) => {
      const { fullName, username, password, studentId } = req.body;

      try {
        const newUser = new User({
          name: fullName,
          username,
          password,
          studentId,
          role: 'student',
        });

        await newUser.save();
        return res.status(201).json({ message: 'User registered successfully!' });
      } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Error registering user' });
      }
    };

    await registerUser(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.data).toEqual({ message: 'Error registering user' });
    expect(User.prototype.save).toHaveBeenCalledTimes(1);
  });
});
