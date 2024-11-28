const Instructor = require('../models/Instructor'); 

jest.mock('../models/Instructor'); 

describe('POST / - Register Instructor', () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  it('should register a new instructor successfully', async () => {
    const req = {
      body: {
        fullName: 'John Doe',
        username: 'johndoe',
        password: 'password123',
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

    Instructor.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(true),
    })); 

    const registerInstructor = async (req, res) => {
      const { fullName, username, password } = req.body;
      try {
        const newInstructor = new Instructor({
          name: fullName,
          username,
          password,
          role: 'instructor',
        });

        await newInstructor.save();
        return res.status(201).json({ message: 'Instructor registered successfully!' });
      } 
      catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Error registering instructor' });
      }
    };

    await registerInstructor(req, res);

    expect(res.statusCode).toBe(201);
    expect(res.data).toEqual({ message: 'Instructor registered successfully!' });
    expect(Instructor).toHaveBeenCalledWith({
      name: 'John Doe',
      username: 'johndoe',
      password: 'password123',
      role: 'instructor',
    });
  });

  it('should return 500 if registration fails', async () => {
    const req = {
      body: {
        fullName: 'Jane Smith',
        username: 'janesmith',
        password: 'password456',
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

    Instructor.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error('Database error')),
    })); 

    const registerInstructor = async (req, res) => {
      const { fullName, username, password } = req.body;
      try {
        const newInstructor = new Instructor({
          name: fullName,
          username,
          password,
          role: 'instructor',
        });

        await newInstructor.save();
        return res.status(201).json({ message: 'Instructor registered successfully!' });
      } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Error registering instructor' });
      }
    };

    await registerInstructor(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.data).toEqual({ message: 'Error registering instructor' });
  });
});

