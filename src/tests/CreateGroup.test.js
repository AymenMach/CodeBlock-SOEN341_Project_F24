
// unit test CreateGroup.js
const { CreateGroup } = require('../controllers/CreateGroup');
const Group = require('../models/Group');

// Mock the Group model
jest.mock('../models/Group');

describe('CreateGroup Function', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    // Mock request and response objects
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return 400 if groupName is not provided', async () => {
    await CreateGroup(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Group name is required' });
  });

  it('should create a group and return 201', async () => {
    mockReq.body.groupName = 'Test Group';
    const mockGroup = { name: 'Test Group', save: jest.fn() };

    // Mock Group constructor
    Group.mockImplementation(() => mockGroup);

    await CreateGroup(mockReq, mockRes);

    expect(Group).toHaveBeenCalledWith({ name: 'Test Group' });
    expect(mockGroup.save).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(mockGroup);
  });

  it('should return 500 if there is an error', async () => {
    mockReq.body.groupName = 'Test Group';

    // Mock Group constructor to throw an error
    Group.mockImplementation(() => {
      throw new Error('Database error');
    });

    await CreateGroup(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error creating group' });
  });
});

