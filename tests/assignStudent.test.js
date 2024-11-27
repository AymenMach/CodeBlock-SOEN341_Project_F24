const { assignStudent } = require('../controllers/CreateGroup'); // Import the function
const Group = require('../models/group'); // Mock Group model
const User = require('../models/User'); // Mock User model

jest.mock('../models/group'); // Mock Group model
jest.mock('../models/User'); // Mock User model

describe('assignStudent Function', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = { body: {} }; // Initialize mock request
    mockRes = {
      status: jest.fn().mockReturnThis(), // Mock status method
      json: jest.fn(), // Mock json method
    };
    jest.clearAllMocks(); // Clear mock calls
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

   it('should add a student to the group and return 200 with updated group', async () => {
    const mockGroup = {
      students: [],
      save: jest.fn().mockResolvedValueOnce(),
    };

    const mockPopulatedGroup = {
      students: [{ _id: 'studentID2', username: 'John Doe' }],
    };

    Group.findById
      .mockResolvedValueOnce(mockGroup) // Initial group
      .mockResolvedValueOnce(mockPopulatedGroup); // Populated group after save
    User.findById.mockResolvedValueOnce({ _id: 'studentID2' });

    mockReq.body = { groupID: 'groupID1', studentID: 'studentID2' };

    await assignStudent(mockReq, mockRes);

    expect(Group.findById).toHaveBeenCalledWith('groupID1');
    expect(User.findById).toHaveBeenCalledWith('studentID2');
    expect(mockGroup.students).toContain('studentID2');
    expect(mockGroup.save).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockPopulatedGroup);
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

  it('should return 500 if there is an error', async () => {
    Group.findById.mockRejectedValueOnce(new Error('Database error'));

    mockReq.body = { groupID: 'groupID1', studentID: 'studentID2' };

    await assignStudent(mockReq, mockRes);

    expect(Group.findById).toHaveBeenCalledWith('groupID1');
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error assigning student' });
  });
});
