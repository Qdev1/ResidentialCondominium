// notificationController.test.js
const notificationController = require('../controllers/notificationController'); // Import notificationController
const db = require('../config/db');

jest.mock('../config/db');
const nodemailer = require('nodemailer');
jest.mock('nodemailer');

describe('createNotification', () => {
  it('successfully creates a notification and sends emails', async () => {
    // Arrange
    const req = {
      body: {
        title: 'New Event',
        content: 'There is an upcoming event this weekend.',
        role: 'resident',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    db.execute.mockResolvedValueOnce([{ insertId: 1 }]);
    db.execute.mockResolvedValueOnce([[
      { email: 'user1@example.com' },
      { email: 'user2@example.com' }
    ]]);

    const sendMailMock = jest.fn();
    nodemailer.createTransport.mockReturnValue({
      sendMail: sendMailMock,
    });

    // Act
    await notificationController.createNotification(req, res);

    // Assert
    expect(db.execute).toHaveBeenCalledWith('INSERT INTO notifications (title, content, role) VALUES (?, ?, ?)', [req.body.title, req.body.content, req.body.role]);
    expect(db.execute).toHaveBeenCalledWith('SELECT * FROM users WHERE role = ?', [req.body.role]);
    expect(sendMailMock).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Notification created and sent to residents successfully', status: true });
  });

  // Additional test cases should be added here
});

describe('getNotificationsByRole', () => {
  it('successfully retrieves notifications by role', async () => {
    // Arrange
    const req = {
      params: {
        role: 'resident',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockNotifications = [
      { id: 1, title: 'Event Notification', content: 'Details about the event.', role: 'resident' },
      // Add more mock notifications if needed
    ];
    db.execute.mockResolvedValueOnce([mockNotifications]);

    // Act
    await notificationController.getNotificationsByRole(req, res);

    // Assert
    expect(db.execute).toHaveBeenCalledWith('SELECT * FROM notifications WHERE role = ?', [req.params.role]);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockNotifications);
  });

  // Additional test cases should be added here
});


// describe('createNotification', () => {
//   // Test case 1: valid request body
//   test('should create a notification and send it to all residents and return 201 status and a success message if the request body is valid', async () => {
//     // Arrange
//     const req = {
//       body: {
//         title: 'Thông báo về việc thu phí dịch vụ',
//         content: 'Cư dân vui lòng nộp phí dịch vụ trước ngày 15 tháng 12 năm 2023',
//         role: 'resident',
//       },
//     };
//     const res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };
//     const expectedMessage = {
//       message: 'Notification created and sent to residents successfully',
//       status: true,
//     };
//     db.execute.mockResolvedValueOnce([{ length: 2 }]); // Mock userRows
//     db.execute.mockResolvedValueOnce([{ insertId: 1 }]); // Mock notificationRows

//     // Act
//     await notificationController.createNotification(req, res);

//     // Assert
//     expect(db.execute).toHaveBeenCalledWith(
//       'SELECT * FROM users WHERE role = ?',
//       [req.body.role]
//     );
//     expect(db.execute).toHaveBeenCalledWith(
//       'INSERT INTO notifications (title, content) VALUES (?, ?)',
//       [req.body.title, req.body.content]
//     );
//     expect(res.status).toHaveBeenCalledWith(201);
//     expect(res.json).toHaveBeenCalledWith(expectedMessage);
//   });

//   // Test case 2: missing title in request body
//   test('should return 400 status and an error message if the request body is missing title', async () => {
//     // Arrange
//     const req = {
//       body: {
//         content: 'Cư dân vui lòng nộp phí dịch vụ trước ngày 15 tháng 12 năm 2023',
//         role: 'resident',
//       },
//     };
//     const res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };
//     const expectedError = {
//       message: 'Title is required',
//       status: false,
//     };

//     // Act
//     await notificationController.createNotification(req, res);

//     // Assert
//     expect(db.execute).not.toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.json).toHaveBeenCalledWith(expectedError);
//   });

//   // Test case 3: missing content in request body
//   test('should return 400 status and an error message if the request body is missing content', async () => {
//     // Arrange
//     const req = {
//       body: {
//         title: 'Thông báo về việc thu phí dịch vụ',
//         role: 'resident',
//       },
//     };
//     const res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };
//     const expectedError = {
//       message: 'Content is required',
//       status: false,
//     };

//     // Act
//     await notificationController.createNotification(req, res);

//     // Assert
//     expect(db.execute).not.toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.json).toHaveBeenCalledWith(expectedError);
//   });

//   // Test case 4: missing role in request body
//   test('should return 400 status and an error message if the request body is missing role', async () => {
//     // Arrange
//     const req = {
//       body: {
//         title: 'Thông báo về việc thu phí dịch vụ',
//         content: 'Cư dân vui lòng nộp phí dịch vụ trước ngày 15 tháng 12 năm 2023',
//       },
//     };
//     const res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };
//     const expectedError = {
//       message: 'Role is required',
//       status: false,
//     };

//     // Act
//     await notificationController.createNotification(req, res);

//     // Assert
//     expect(db.execute).not.toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.json).toHaveBeenCalledWith(expectedError);
//   });

//   // Test case 5: invalid role in request body
//   test('should return 400 status and an error message if the role is not "resident"', async () => {
//     // Arrange
//     const req = {
//       body: {
//         title: 'Thông báo về việc thu phí dịch vụ',
//         content: 'Cư dân vui lòng nộp phí dịch vụ trước ngày 15 tháng 12 năm 2023',
//         role: 'manager',
//       },
//     };
//     const res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };
//     const expectedError = {
//       message: 'Invalid role',
//       status: false,
//     };

//     // Act
//     await notificationController.createNotification(req, res);

//     // Assert
//     expect(db.execute).not.toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.json).toHaveBeenCalledWith(expectedError);
//   });
// });
