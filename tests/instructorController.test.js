const { loginInstructor } = require('../controllers/instructorController'); 
const Instructor = require('../models/Instructor'); 

jest.mock('../models/Instructor'); 

describe('loginInstructor Function', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    // Initialize mock request and response
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks(); 
  });

  it('should return 404 if the instructor is not found', async () => {
    Instructor.findOne.mockResolvedValueOnce(null); 

    mockReq.body = { username: 'nonexistent', password: 'password123' };

    await loginInstructor(mockReq, mockRes);

    expect(Instructor.findOne).toHaveBeenCalledWith({ username: 'nonexistent' });
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Instructor not found' });
  });

  it('should return 401 if the password is invalid', async () => {
    Instructor.findOne.mockResolvedValueOnce({ username: 'testuser', password: 'correctpassword' }); 

    mockReq.body = { username: 'testuser', password: 'wrongpassword' };

    await loginInstructor(mockReq, mockRes);

    expect(Instructor.findOne).toHaveBeenCalledWith({ username: 'testuser' });
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid password' });
  });

  it('should return 200 if login is successful', async () => {
    const mockInstructor = { username: 'testuser', password: 'correctpassword' };
    Instructor.findOne.mockResolvedValueOnce(mockInstructor);

    mockReq.body = { username: 'testuser', password: 'correctpassword' };

    await loginInstructor(mockReq, mockRes);

    expect(Instructor.findOne).toHaveBeenCalledWith({ username: 'testuser' });
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Login successful',
      instructor: mockInstructor,
    });
  });

  it('should return 500 if there is a server error', async () => {
    Instructor.findOne.mockRejectedValueOnce(new Error('Database error')); 

    mockReq.body = { username: 'testuser', password: 'password123' };

    await loginInstructor(mockReq, mockRes);

    expect(Instructor.findOne).toHaveBeenCalledWith({ username: 'testuser' });
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error logging in instructor' });
  });
});
