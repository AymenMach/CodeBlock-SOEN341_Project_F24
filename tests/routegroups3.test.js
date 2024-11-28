// Testing Create a new group
const Group = require('../models/group'); 

jest.mock('../models/group'); 

describe('POST /create - Create a New Group', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test
  });

  it('should create a new group successfully', async () => {
    const req = {
      body: {
        name: 'New Group',
      },
    }; // Mock the request object

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

    Group.findOne.mockResolvedValue(null); // Mock to simulate no existing group
    Group.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({
        name: 'New Group',
        students: [],
        participants: [],
      }),
    })); // Mock the save method

    const createGroup = async (req, res) => {
      const { name } = req.body;
      try {
        const existingGroup = await Group.findOne({ name });
        if (existingGroup) {
          return res.status(400).json({ message: 'Group name already exists' });
        }

        const newGroup = new Group({ name, students: [], participants: [] });
        await newGroup.save();
        res.status(201).json(newGroup);
      } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ message: 'Error creating group' });
      }
    };

    await createGroup(req, res);

    expect(res.statusCode).toBe(201);
    expect(res.data).toEqual({
      name: 'New Group',
      students: [],
      participants: [],
    });
    expect(Group.findOne).toHaveBeenCalledWith({ name: 'New Group' });
    expect(Group.findOne).toHaveBeenCalledTimes(1);
  });

  it('should return 400 if group name already exists', async () => {
    const req = {
      body: {
        name: 'Existing Group',
      },
    }; // Mock the request object

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

    Group.findOne.mockResolvedValue({ name: 'Existing Group' }); // Mock to simulate existing group

    const createGroup = async (req, res) => {
      const { name } = req.body;
      try {
        const existingGroup = await Group.findOne({ name });
        if (existingGroup) {
          return res.status(400).json({ message: 'Group name already exists' });
        }

        const newGroup = new Group({ name, students: [], participants: [] });
        await newGroup.save();
        res.status(201).json(newGroup);
      } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ message: 'Error creating group' });
      }
    };

    await createGroup(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.data).toEqual({ message: 'Group name already exists' });
    expect(Group.findOne).toHaveBeenCalledWith({ name: 'Existing Group' });
    expect(Group.findOne).toHaveBeenCalledTimes(1);
  });

  it('should return 500 if an error occurs during group creation', async () => {
    const req = {
      body: {
        name: 'New Group',
      },
    }; // Mock the request object

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

    Group.findOne.mockRejectedValue(new Error('Database error')); // Mock the findOne method to throw an error

    const createGroup = async (req, res) => {
      const { name } = req.body;
      try {
        const existingGroup = await Group.findOne({ name });
        if (existingGroup) {
          return res.status(400).json({ message: 'Group name already exists' });
        }

        const newGroup = new Group({ name, students: [], participants: [] });
        await newGroup.save();
        res.status(201).json(newGroup);
      } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ message: 'Error creating group' });
      }
    };

    await createGroup(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.data).toEqual({ message: 'Error creating group' });
    expect(Group.findOne).toHaveBeenCalledWith({ name: 'New Group' });
    expect(Group.findOne).toHaveBeenCalledTimes(1);
  });
});
