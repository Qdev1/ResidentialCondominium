// complaintController.test.js
const complaintController = require('../controllers/complaintController');
const db = require('../config/db');

jest.mock('../config/db');

describe('submitComplaint', () => {
  beforeEach(() => {
    db.execute.mockReset();
  });

  const mockReq = (userId, subject, description) => ({
    body: { user_id: userId, subject, description }
  });

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn();
    return res;
  };

  it('successfully submits a complaint', async () => {
    const req = mockReq(1, 'Noise Complaint', 'Loud noise after 10 PM');
    const res = mockRes();
    db.execute.mockResolvedValueOnce([[{ id: 1 }]]).mockResolvedValueOnce([{ insertId: 1 }]);

    await complaintController.submitComplaint(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Complaint submitted successfully', status: true });
  });

  it('handles non-existent user', async () => {
    const req = mockReq(999, 'Noise Complaint', 'Loud noise after 10 PM');
    const res = mockRes();
    db.execute.mockResolvedValueOnce([[]]);

    await complaintController.submitComplaint(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found', status: false });
  });

  it('handles database errors during user check', async () => {
    const req = mockReq(1, 'Noise Complaint', 'Loud noise after 10 PM');
    const res = mockRes();
    db.execute.mockRejectedValueOnce(new Error('Database error'));

    await complaintController.submitComplaint(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.any(Object));
  });

  it('handles database error during complaint insertion', async () => {
    const req = mockReq(1, 'Noise Complaint', 'Loud noise after 10 PM');
    const res = mockRes();
    db.execute.mockResolvedValueOnce([[{ id: 1 }]]).mockRejectedValueOnce(new Error('Database error'));

    await complaintController.submitComplaint(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.any(Object));
  });

  it('handles missing user ID', async () => {
    const req = {
      body: {
        subject: 'Noise Complaint',
        description: 'Loud noise after 10 PM'
      }
    };
    const res = mockRes();

    await complaintController.submitComplaint(req, res);

    // Assuming your controller or middleware handles validation
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('handles missing subject', async () => {
    const req = mockReq(1, '', 'Loud noise after 10 PM');
    const res = mockRes();

    await complaintController.submitComplaint(req, res);

    // Assuming your controller or middleware handles validation
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('handles missing description', async () => {
    const req = mockReq(1, 'Noise Complaint', '');
    const res = mockRes();

    await complaintController.submitComplaint(req, res);

    // Assuming your controller or middleware handles validation
    expect(res.status).toHaveBeenCalledWith(400);
  });
  // Additional Test Cases

it('handles empty request body', async () => {
    const req = { body: {} };
    const res = mockRes();
  
    await complaintController.submitComplaint(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
    // Additional assertions for response body
  });
  
  it('handles partially filled request body', async () => {
    const req = mockReq(1, 'Noise Complaint', '');
    const res = mockRes();
  
    await complaintController.submitComplaint(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
    // Additional assertions for response body
  });
  
  it('handles invalid data types for user_id', async () => {
    const req = mockReq('invalid', 'Noise Complaint', 'Loud noise');
    const res = mockRes();
  
    await complaintController.submitComplaint(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
    // Additional assertions for response body
  });
  
  // ... Additional test cases ...
  
});

