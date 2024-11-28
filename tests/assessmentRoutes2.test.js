const express = require('express');
const request = require('supertest'); 
const router = require('../routes/assessmentRoutes');
const Assessment = require('../models/assessments'); 

jest.mock('../models/assessments'); 

const app = express();
app.use(express.json());
app.use('/', router);

describe('GET / - Fetch Assessments', () => {
  it('should return 200 and an array of assessments on success', async () => {

    const mockAssessments = [
      { id: '1', groupId: '123', assessorId: 'assessor1', ratings: [] },
      { id: '2', groupId: '456', assessorId: 'assessor2', ratings: [] },
    ];
    Assessment.find.mockResolvedValue(mockAssessments);


    const response = await request(app).get('/');

    // Assertions
    expect(response.status).toBe(200); 
    expect(response.body).toEqual(mockAssessments); 
    expect(Assessment.find).toHaveBeenCalledTimes(1); 
  });

  it('should return 500 and an error message if an error occurs', async () => {
  
    Assessment.find.mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/');

    // Assertions
    expect(response.status).toBe(500); 
    expect(response.body).toEqual({
      message: 'Failed to fetch assessments',
      error: 'Database error',
    }); 
    expect(Assessment.find).toHaveBeenCalledTimes(1); 
  });
});

