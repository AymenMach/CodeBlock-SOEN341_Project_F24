// Testing Add a comment
const Group = require('../models/group'); // Mock the Group model

jest.mock('../models/group'); // Mock the Group model

describe('POST /add-comment - Add Comment to a Group', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test
  });

  it('should successfully add a comment to a group', async () => {
    const req = {
      body: {
        groupId: '12345',
        studentId: '101',
        comment: 'This is a test comment.',
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

    const mockGroup = {
      _id: '12345',
      name: 'Group 1',
      comments: [],
      save: jest.fn().mockResolvedValue(true), // Mock save method
    };

    Group.findById.mockResolvedValue(mockGroup);

    const addComment = async (req, res) => {
      const { groupId, studentId, comment } = req.body;

      try {
        const group = await Group.findById(groupId);
        if (!group) {
          return res.status(404).json({ message: 'Group not found' });
        }

        group.comments.push({ studentId, comment });
        await group.save();
        res.status(200).json(group);
      } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Error adding comment' });
      }
    };

    await addComment(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.data).toEqual(mockGroup);
    expect(Group.findById).toHaveBeenCalledWith('12345');
    expect(mockGroup.save).toHaveBeenCalledTimes(1);
  });

  it('should return 404 if the group is not found', async () => {
    const req = {
      body: {
        groupId: 'invalidGroupId',
        studentId: '101',
        comment: 'This is a test comment.',
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

    Group.findById.mockResolvedValue(null); // Simulate no group found

    const addComment = async (req, res) => {
      const { groupId, studentId, comment } = req.body;

      try {
        const group = await Group.findById(groupId);
        if (!group) {
          return res.status(404).json({ message: 'Group not found' });
        }

        group.comments.push({ studentId, comment });
        await group.save();
        res.status(200).json(group);
      } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Error adding comment' });
      }
    };

    await addComment(req, res);

    expect(res.statusCode).toBe(404);
    expect(res.data).toEqual({ message: 'Group not found' });
    expect(Group.findById).toHaveBeenCalledWith('invalidGroupId');
  });

  it('should return 500 if an error occurs while adding a comment', async () => {
    const req = {
      body: {
        groupId: '12345',
        studentId: '101',
        comment: 'This is a test comment.',
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

    Group.findById.mockRejectedValue(new Error('Database error')); // Simulate a database error

    const addComment = async (req, res) => {
      const { groupId, studentId, comment } = req.body;

      try {
        const group = await Group.findById(groupId);
        if (!group) {
          return res.status(404).json({ message: 'Group not found' });
        }

        group.comments.push({ studentId, comment });
        await group.save();
        res.status(200).json(group);
      } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Error adding comment' });
      }
    };

    await addComment(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.data).toEqual({ message: 'Error adding comment' });
    expect(Group.findById).toHaveBeenCalledWith('12345');
  });
});





