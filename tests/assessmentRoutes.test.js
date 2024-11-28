// testing the submission assessment POST
const express = require('express');
const router = require('../routes/assessmentRoutes');
const Assessment = require('../models/assessments');
const Group = require('../models/group');

jest.mock('../models/group'); 
jest.mock('../models/assessments'); 

const app = express();
app.use(express.json());
app.use('/', router);

describe('POST / - Submit Assessments', () => {
  it('should save assessment and return 201 on success', async () => {
    Group.findById.mockResolvedValue({ id: '123', name: 'Test Group' });
    Assessment.prototype.save = jest.fn().mockResolvedValue({ id: 'assessmentId' });

    const response = await request(app).post('/').send({
      groupId: '123',
      assessorId: 'assessor123',
      ratings: [
        { memberId: 'member123', cooperation: 5, conceptual: 4, practical: 3, workEthic: 5 },
      ],
    });

    expect(response.status).toBe(201);
    expect(Assessment.prototype.save).toHaveBeenCalled();
  });

  it('should return 400 if required fields are missing', async () => {
    const response = await request(app).post('/').send({});
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Missing required fields');
  });

  it('should return 404 if group is not found', async () => {
    Group.findById.mockResolvedValue(null);

    const response = await request(app).post('/').send({
      groupId: 'invalidGroupId',
      assessorId: 'assessor123',
      ratings: [],
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Group not found');
  });
});
