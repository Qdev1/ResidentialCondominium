// notificationController.test.js
const notificationController = require('../controllers/notificationController'); // Import notificationController
const db = require('../config/db');

jest.mock('../config/db');
const nodemailer = require('nodemailer');
jest.mock('nodemailer');

describe('notificationController', () => {
  let mockResponse;

  beforeEach(() => {
      mockResponse = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockReturnThis(),
      };
  });

  describe('createNotification', () => {
      it('should successfully create a notification and send to residents', async () => {
          const req = {
              body: {
                  title: 'Test Title',
                  content: 'Test Content',
                  role: 'resident'
              }
          };

          const mockNotificationRows = { insertId: 1 };
          db.execute.mockResolvedValueOnce([mockNotificationRows]);

          const mockUserRows = [{ email: 'test@example.com' }];
          db.execute.mockResolvedValueOnce([mockUserRows]);

          const mockTransporter = {
              sendMail: jest.fn().mockImplementation((mailOptions, callback) => callback(null, true)),
          };
          nodemailer.createTransport.mockReturnValue(mockTransporter);

          await notificationController.createNotification(req, mockResponse);

          expect(db.execute).toHaveBeenCalledWith(
              'INSERT INTO notifications (title, content, role) VALUES (?, ?, ?)',
              [req.body.title, req.body.content, req.body.role]
          );
          expect(db.execute).toHaveBeenCalledWith('SELECT * FROM users WHERE role = ?', [req.body.role]);
          expect(mockTransporter.sendMail).toHaveBeenCalled();
          expect(mockResponse.status).toHaveBeenCalledWith(201);
          expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Notification created and sent to residents successfully', status: true });
      });

      it('should handle database errors when creating a notification', async () => {
          const req = {
              body: {
                  title: 'Test Title',
                  content: 'Test Content',
                  role: 'resident'
              }
          };

          const mockError = new Error('Database error');
          db.execute.mockRejectedValueOnce(mockError);

          await notificationController.createNotification(req, mockResponse);

          expect(mockResponse.status).toHaveBeenCalledWith(500);
          expect(mockResponse.json).toHaveBeenCalledWith(mockError);
      });
  });

  describe('getNotificationsByRole', () => {
    it('should successfully get notifications by role', async () => {
        const req = {
            params: {
                role: 'resident'
            }
        };

        const mockNotificationRows = [
            { id: 1, title: 'Test Title', content: 'Test Content', role: 'resident' }
        ];
        db.execute.mockResolvedValueOnce([mockNotificationRows]);

        await notificationController.getNotificationsByRole(req, mockResponse);

        expect(db.execute).toHaveBeenCalledWith('SELECT * FROM notifications WHERE role = ?', [req.params.role]);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockNotificationRows);
    });

    it('should handle database errors when getting notifications by role', async () => {
        const req = {
            params: {
                role: 'resident'
            }
        };

        const mockError = new Error('Database error');
        db.execute.mockRejectedValueOnce(mockError);

        await notificationController.getNotificationsByRole(req, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
});

});