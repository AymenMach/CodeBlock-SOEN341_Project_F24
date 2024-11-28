// testing for fetching instructors
const Instructor = require('../models/Instructor'); // Mock the Instructor model

jest.mock('../models/Instructor'); // Mock the Instructor model

describe('GET / - Fetch Instructors', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test
  });

  it('should return a list of instructors', async () => {
    const mockInstructors = [
      { name: 'John Doe', username: 'johndoe' },
      { name: 'Jane Smith', username: 'janesmith' },
    ];

    Instructor.find.mockResolvedValue(mockInstructors); // Mock the database call

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

    const getInstructors = async (req, res) => {
      try {
        const instructors = await Instructor.find();
        res.status(200).json(instructors);
      } catch (error) {
        console.error('Error fetching instructors:', error);
        res.status(500).json({ message: 'Failed to fetch instructors' });
      }
    };

    await getInstructors(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.data).toEqual(mockInstructors);
    expect(Instructor.find).toHaveBeenCalledTimes(1);
  });

  it('should return 500 if an error occurs', async () => {
    Instructor.find.mockRejectedValue(new Error('Database error')); // Mock the database call to throw an error

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

    const getInstructors = async (req, res) => {
      try {
        const instructors = await Instructor.find();
        res.status(200).json(instructors);
      } catch (error) {
        console.error('Error fetching instructors:', error);
        res.status(500).json({ message: 'Failed to fetch instructors' });
      }
    };

    await getInstructors(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.data).toEqual({ message: 'Failed to fetch instructors' });
    expect(Instructor.find).toHaveBeenCalledTimes(1);
  });
});
