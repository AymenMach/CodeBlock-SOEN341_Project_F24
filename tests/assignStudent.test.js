const { assignStudent } = require('../controllers/CreateGroup'); // Import assignStudent
const Group = require('../models/group'); 
const User = require('../models/User'); 

jest.mock('../models/group', () => ({
  findById: jest.fn(),
  prototype: {
    save: jest.fn(),
  },
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
    jest.clearAllMocks();
  });

  it('should return 404 if group or student is not found', async () => {
    Group.findById.mockResolvedValueOnce(null);
    User.findById.mockResolvedValueOnce(null);

    mockReq.body = { groupID: 'invalidGroupID', studentID: 'invalidStudentID' };

    await assignStudent(mockReq, mockRes);

    expect(Group.findById).toHaveBeenCalledWith('invalidGroupID');
    expect(User.findById).toHaveBeenCalledWith('invalidStudentID');
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Group or student not found' });
  });

  it('should return 400 if student is already in the group', async () => {
    Group.findById.mockResolvedValueOnce({ students: ['studentID1'], save: jest.fn() });
    User.findById.mockResolvedValueOnce({ _id: 'studentID1' });

    mockReq.body = { groupID: 'groupID1', studentID: 'studentID1' };

    await assignStudent(mockReq, mockRes);

    expect(Group.findById).toHaveBeenCalledWith('groupID1');
    expect(User.findById).toHaveBeenCalledWith('studentID1');
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Student already in group' });
  });

  it('should add a student to the group and return 200 with updated group', async () => {
    const mockGroup = {
      students: [],
      save: jest.fn(),
    };

    const mockUpdatedGroup = {
      students: ['studentID2'],
      populate: jest.fn().mockResolvedValue({ students: [{ _id: 'studentID2', username: 'John Doe' }] }),
    };

    Group.findById
      .mockResolvedValueOnce(mockGroup)
      .mockResolvedValueOnce(mockUpdatedGroup);
    User.findById.mockResolvedValueOnce({ _id: 'studentID2' });

    mockReq.body = { groupID: 'groupID1', studentID: 'studentID2' };

    await assignStudent(mockReq, mockRes);

    expect(Group.findById).toHaveBeenCalledWith('groupID1');
    expect(User.findById).toHaveBeenCalledWith('studentID2');
    expect(mockGroup.students).toContain('studentID2');
    expect(mockGroup.save).toHaveBeenCalled();
    expect(Group.findById).toHaveBeenCalledTimes(2);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ students: [{ _id: 'studentID2', username: 'John Doe' }] });
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
