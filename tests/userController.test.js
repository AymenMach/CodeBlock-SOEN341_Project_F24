const { loginUser } = require('../controllers/userController'); // Import the function
const User = require('../models/User'); // Mock User model
const Instructor = require('../models/Instructor'); // Mock Instructor model

jest.mock('../models/User'); // Mock User model
jest.mock('../models/Instructor'); // Mock Instructor model

describe('loginUser Function', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    // Initialize mock request and response
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(), // Mock status method
      json: jest.fn(), // Mock json method
    };
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  it('should return 401 if user credentials are invalid', async () => {
    User.findOne.mockResolvedValueOnce(null); // Simulate no student found
    Instructor.findOne.mockResolvedValueOnce(null); // Simulate no instructor found

    mockReq.body = { username: 'nonexistent', password: 'wrongpassword' };

    await loginUser(mockReq, mockRes);

    expect(User.findOne).toHaveBeenCalledWith({ username: 'nonexistent' });
    expect(Instructor.findOne).toHaveBeenCalledWith({ username: 'nonexistent' });
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  it('should return 401 if password is incorrect', async () => {
    User.findOne.mockResolvedValueOnce({ username: 'testuser', password: 'correctpassword', role: 'student' });

    mockReq.body = { username: 'testuser', password: 'wrongpassword' };

    await loginUser(mockReq, mockRes);

    expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
    expect(Instructor.findOne).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  it('should return 200 for valid student credentials', async () => {
    const mockUser = { username: 'testuser', password: 'correctpassword', role: 'student', _id: 'userID1' };
    User.findOne.mockResolvedValueOnce(mockUser);

    mockReq.body = { username: 'testuser', password: 'correctpassword' };

    await loginUser(mockReq, mockRes);

    expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
    expect(Instructor.findOne).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      role: 'student',
      username: 'testuser',
      _id: 'userID1',
    });
  });

  it('should return 200 for valid instructor credentials', async () => {
    const mockInstructor = { username: 'testinstructor', password: 'correctpassword', role: 'instructor', _id: 'instructorID1' };
    User.findOne.mockResolvedValueOnce(null); // Simulate no student found
    Instructor.findOne.mockResolvedValueOnce(mockInstructor);

    mockReq.body = { username: 'testinstructor', password: 'correctpassword' };

    await loginUser(mockReq, mockRes);

    expect(User.findOne).toHaveBeenCalledWith({ username: 'testinstructor' });
    expect(Instructor.findOne).toHaveBeenCalledWith({ username: 'testinstructor' });
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      role: 'instructor',
      username: 'testinstructor',
      _id: 'instructorID1',
    });
  });

  it('should return 500 if there is a server error', async () => {
    User.findOne.mockRejectedValueOnce(new Error('Database error')); // Simulate an error

    mockReq.body = { username: 'testuser', password: 'password123' };

    await loginUser(mockReq, mockRes);

    expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server error' });
  });
});

