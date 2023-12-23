// Mocks
jest.mock('../config/db'); 
jest.mock('nodemailer');

// Test file
const residentEventsController = require('../controllers/residentEventsController');

describe('residentEventsController', () => {
  let mockReq, mockRes, mockSendMail;

  beforeEach(() => {
    mockReq = {
      body: {
        title: 'Annual General Meeting',
        date: '2023-12-01',
        description: 'Discussing important topics',
        location: 'Conference Room',
        role: 'resident'
      }
    };
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    mockSendMail = jest.fn();
    nodemailer.createTransport.mockReturnValue({ sendMail: mockSendMail });
  });

  describe('createMeeting', () => {
    test('should create a meeting and send email notifications', async () => {
      // Mock database response for meeting creation
      db.execute.mockResolvedValueOnce([{ insertId: 1 }]);
      // Mock database response for user retrieval
      db.execute.mockResolvedValueOnce([[{ email: 'resident@example.com' }]]);

      await residentEventsController.createMeeting(mockReq, mockRes);

      expect(db.execute).toHaveBeenCalledWith(
        'INSERT INTO meetings (title, date, description, location) VALUES (?, ?, ?, ?)',
        [mockReq.body.title, mockReq.body.date, mockReq.body.description, mockReq.body.location]
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Meeting created successfully',
        meetingId: 1,
        status: true
      });
      expect(mockSendMail).toHaveBeenCalled();
    });

    // Add more tests here for error handling, invalid inputs, etc.
  });
  describe('registerForMeeting', () => {

    it('registers user for meeting & sends notification', async () => {
  
      // Arrange
      const req = {
        body: {
          meetingId: 1,
          userId: 123  
        }
      };
      
      const res = {
        status: jest.fn(),
        json: jest.fn()   
      };
      
      db.execute.mockResolvedValue([[{}]]); // meeting exists
      db.execute.mockResolvedValue([[{email: 'test@email.com'}]]); // user exists
      
      const mockTransporter = {
       sendMail: jest.fn()
      };
  
      nodemailer.createTransport.mockReturnValue(mockTransporter);
  
      // Act
      await residentEventsController.registerForMeeting(req, res);
  
      // Assert
      expect(db.execute).toHaveBeenCalledTimes(2);
      expect(nodemailer.createTransport).toHaveBeenCalledTimes(1);
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
  
    });
  
  });
  // Add tests for other methods in the controller if they exist
});
