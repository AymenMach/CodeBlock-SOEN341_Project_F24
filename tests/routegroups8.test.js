// Testing Delete a group
const Group = require('../models/group'); // Mock the Group model

jest.mock('../models/group'); // Mock the Group model

describe('DELETE /:id - Delete a Group', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test
  });

  it('should successfully delete a group', async () => {
    const req = {
      params: {
        id: '12345',
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

    const mockDeletedGroup = {
      _id: '12345',
      name: 'Test Group',
    };

    Group.findByIdAndDelete.mockResolvedValue(mockDeletedGroup);

    const deleteGroup = async (req, res) => {
      try {
        const groupId = req.params.id;
        const deletedGroup = await Group.findByIdAndDelete(groupId);
        if (!deletedGroup) {
          return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json({ message: 'Group deleted successfully' });
      } catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };

    await deleteGroup(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.data).toEqual({ message: 'Group deleted successfully' });
    expect(Group.findByIdAndDelete).toHaveBeenCalledWith('12345');
    expect(Group.findByIdAndDelete).toHaveBeenCalledTimes(1);
  });

  it('should return 404 if the group is not found', async () => {
    const req = {
      params: {
        id: 'invalidGroupId',
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

    Group.findByIdAndDelete.mockResolvedValue(null); // Simulate no group found

    const deleteGroup = async (req, res) => {
      try {
        const groupId = req.params.id;
        const deletedGroup = await Group.findByIdAndDelete(groupId);
        if (!deletedGroup) {
          return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json({ message: 'Group deleted successfully' });
      } catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };

    await deleteGroup(req, res);

    expect(res.statusCode).toBe(404);
    expect(res.data).toEqual({ message: 'Group not found' });
    expect(Group.findByIdAndDelete).toHaveBeenCalledWith('invalidGroupId');
    expect(Group.findByIdAndDelete).toHaveBeenCalledTimes(1);
  });

  it('should return 500 if an error occurs while deleting a group', async () => {
    const req = {
      params: {
        id: '12345',
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

    Group.findByIdAndDelete.mockRejectedValue(new Error('Database error')); // Simulate a database error

    const deleteGroup = async (req, res) => {
      try {
        const groupId = req.params.id;
        const deletedGroup = await Group.findByIdAndDelete(groupId);
        if (!deletedGroup) {
          return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json({ message: 'Group deleted successfully' });
      } catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };

    await deleteGroup(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.data).toEqual({ message: 'Internal server error' });
    expect(Group.findByIdAndDelete).toHaveBeenCalledWith('12345');
    expect(Group.findByIdAndDelete).toHaveBeenCalledTimes(1);
  });
});


