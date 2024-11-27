// Unit test controllers/CreateGroup
const { createGroup } = require('../controllers/CreateGroup'); 
const Group = require('../models/group');
const User = require('../models/User'); 

// Mock the Group model
jest.mock('../models/group', () => {
  return jest.fn().mockImplementation(() => ({
    save: jest.fn(), // Mock the save method
  }));
});

// Mock the User model if needed
jest.mock('../models/User', () => {
  return {
    findById: jest.fn(), // Mock findById if needed in your tests
  };
});

describe('createGroup Function', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    // Reset mock request and response objects
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should return 400 if groupName is not provided', async () => {
    await createGroup(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Group name is required' });
  });

  it('should create a group and return 201', async () => {
    mockReq.body.groupName = 'Test Group';

    const mockGroupInstance = { name: 'Test Group', save: jest.fn() };
    Group.mockImplementation(() => mockGroupInstance); // Mock Group constructor

    await createGroup(mockReq, mockRes);

    expect(Group).toHaveBeenCalledWith({ name: 'Test Group' });
    expect(mockGroupInstance.save).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(mockGroupInstance);
  });

  it('should return 500 if there is an error', async () => {
    mockReq.body.groupName = 'Test Group';

    Group.mockImplementation(() => {
      throw new Error('Database error'); // Simulate error
    });

    await createGroup(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error creating group' });
  });
});
