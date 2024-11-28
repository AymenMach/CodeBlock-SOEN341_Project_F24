// test assessmentRoutes for GET submission
const httpMocks = require('node-mocks-http');
const { get } = require('../routes/assessmentRoutes'); 
const Assessment = require('../models/assessments'); 

jest.mock('../models/assessments'); 

describe('GET / - Fetch Assessments', () => {
  it('should return 200 and an array of assessments on success', async () => {
    const mockAssessments = [
      { id: '1', groupId: '123', assessorId: 'assessor1', ratings: [] },
      { id: '2', groupId: '456', assessorId: 'assessor2', ratings: [] },
    ];
    Assessment.find.mockResolvedValue(mockAssessments);

    const req = httpMocks.createRequest({ method: 'GET', url: '/' });
    const res = httpMocks.createResponse();

    await get(req, res);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(mockAssessments);
    expect(Assessment.find).toHaveBeenCalledTimes(1);
  });

  it('should return 500 and an error message if an error occurs', async () => {
    Assessment.find.mockRejectedValue(new Error('Database error'));

    const req = httpMocks.createRequest({ method: 'GET', url: '/' });
    const res = httpMocks.createResponse();

    await get(req, res);

    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Failed to fetch assessments',
      error: 'Database error',
    });
    expect(Assessment.find).toHaveBeenCalledTimes(1);
  });
});
