const { assignStudent } = require('../controllers/CreateGroup'); // Import the function
const Group = require('../models/group'); // Mock Group model
const User = require('../models/User'); // Mock User model

// Mock the models
jest.mock('../models/group', () => ({
  findById: jest.fn(),
  prototype: { save: jest.fn() },
}));
jest.mock('../models/User', () => ({
  findById: jest.fn(),
}));

describe('assignStudent Function', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  it('should return 404 if group or student is not found', async () => {
    Group.findById.mockResolvedValueOnce(null); // Group not found
    User.findById.mockResolvedValueOnce(null); // Student not found

    mockReq.body = { groupID: 'invalidGroupID', studentID: 'invalidStudentID' };

    await assignStudent(mockReq, mockRes);

    expect(Group.findById).toHaveBeenCalledWith('invalidGroupID');
    expect(User.findById).toHaveBeenCalledWith('invalidStudentID');
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Group or student not found' });
  });

  it('should return 400 if student is already in the group', async () => {
    Group.findById.mockResolvedValueOnce({
      students: ['studentID1'], // Student already exists in the group
      save: jest.fn(),
    });
    User.findById.mockResolvedValueOnce({ _id: 'studentID1' });

    mockReq.body = { groupID: 'groupID1', studentID: 'studentID1' };

    await assignStudent(mockReq, mockRes);

    expect(Group.findById).toHaveBeenCalledWith('groupID1');
    expect(User.findById).toHaveBeenCalledWith('studentID1');
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Student already in group' });
  });

  it('should add a student to the group and return 200 with updated group', async () => {
    // Mock initial group object
    const mockGroup = {
      students: [],
      save: jest.fn().mockResolvedValueOnce(), // Simulate successful save
    };

    // Mock updated group after save and population
    const mockUpdatedGroup = {
      students: [{ _id: 'studentID2', username: 'John Doe' }],
      populate: jest.fn().mockResolvedValueOnce({
        students: [{ _id: 'studentID2', username: 'John Doe' }],
      }),
    };

    // Mock database responses
    Group.findById
      .mockResolvedValueOnce(mockGroup) // Return the initial group
      .mockResolvedValueOnce(mockUpdatedGroup); // Return populated group after save
    User.findById.mockResolvedValueOnce({ _id: 'studentID2' }); // Simulate finding the student

    // Mock request body
    mockReq.body = { groupID: 'groupID1', studentID: 'studentID2' };

    await assignStudent(mockReq, mockRes);

    // Assertions
    expect(Group.findById).toHaveBeenCalledWith('groupID1');
    expect(User.findById).toHaveBeenCalledWith('studentID2');
    expect(mockGroup.students).toContain('studentID2'); // Ensure the student is added
    expect(mockGroup.save).toHaveBeenCalled(); // Ensure the group was saved
    expect(mockRes.status).toHaveBeenCalledWith(200); // Ensure success status
    expect(mockRes.json).toHaveBeenCalledWith({
      students: [{ _id: 'studentID2', username: 'John Doe' }],
    }); // Ensure the correct response
  });

  it('should return 500 if there is an error', async () => {
    // Simulate an error in the group lookup
    Group.findById.mockRejectedValueOnce(new Error('Database error'));

    mockReq.body = { groupID: 'groupID1', studentID: 'studentID2' };

    await assignStudent(mockReq, mockRes);

    expect(Group.findById).toHaveBeenCalledWith('groupID1');
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error assigning student' });
  });
});
