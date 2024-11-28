const Instructor = require('../models/Instructor'); // Mock the Instructor model
const { post: registerInstructor, get: getInstructors } = require('../routes/instructorRoutes');

jest.mock('../models/Instructor'); // Mock the Instructor model

describe('Instructor Routes', () => {
  describe('GET / - Fetch Instructors', () => {
    it('should return a list of instructors', async () => {
      const mockInstructors = [
        { name: 'John Doe', username: 'johndoe' },
        { name: 'Jane Smith', username: 'janesmith' },
      ];

      Instructor.find.mockResolvedValue(mockInstructors); // Mock database call

      const req = {}; // Mock request object
      const res = {
        statusCode: 0,
        data: null,
        json(payload) {
          this.data = payload;
        },
      };

      await getInstructors(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.data).toEqual(mockInstructors);
      expect(Instructor.find).toHaveBeenCalledTimes(1);
    });

    it('should return 500 if an error occurs', async () => {
      Instructor.find.mockRejectedValue(new Error('Database error'));

      const req = {}; // Mock request object
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

      await getInstructors(req, res);

      expect(res.statusCode).toBe(500);
      expect(res.data).toEqual({ message: 'Failed to fetch instructors' });
    });
  });

  describe('POST / - Register Instructor', () => {
    it('should register a new instructor successfully', async () => {
      Instructor.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(true),
      }));

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
      Instructor.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error('Database error')),
      }));

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

      await registerInstructor(req, res);

      expect(res.statusCode).toBe(500);
      expect(res.data).toEqual({ message: 'Error registering instructor' });
    });
  });
});

