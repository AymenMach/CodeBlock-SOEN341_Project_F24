const { AssignStudent } = require('../controllers/CreateGroup');
const Group = require('../models/Group');
const User = require('../models/User');

// Mock the Group and User models
jest.mock('../models/Group');
jest.mock('../models/User');

describe('AssignStudent Function', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    // Mock request and response objects
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return 404 if group or student is not found', async () => {
    mockReq.body = { groupID: 'group1', studentID: 'student1' };
    Group.findById.mockResolvedValue(null); // Mock no group found
    User.findById.mockResolvedValue(null); // Mock no user found

    await AssignStudent(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Group or student not found' });
  });

  it('should return 400 if student is already in the group', async () => {
    mockReq.body = { groupID: 'group1', studentID: 'student1' };

    // Mock group with student already in it
    Group.findById.mockResolvedValue({
      students: ['student1'],
      save: jest.fn(),
    });
    User.findById.mockResolvedValue({}); // Mock a valid student

    await AssignStudent(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Student already in group' });
  });

  it('should assign a student to a group and return 200', async () => {
    mockReq.body = { groupID: 'group1', studentID: 'student1' };

    // Mock group and student
    const mockGroup = { students: [], save: jest.fn() };
    Group.findById.mockResolvedValue(mockGroup);
    User.findById.mockResolvedValue({}); // Mock a valid student

    await AssignStudent(mockReq, mockRes);

    expect(mockGroup.students).toContain('student1');
    expect(mockGroup.save).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalled();
  });

  it('should return 500 if there is an error', async () => {
    mockReq.body = { groupID: 'group1', studentID: 'student1' };

    // Mock Group.findById to throw an error
    Group.findById.mockImplementation(() => {
      throw new Error('Database error');
    });

    await AssignStudent(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error assigning student' });
  });
});

