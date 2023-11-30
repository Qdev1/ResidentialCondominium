const db = require('../config/db');
const nodemailer = require('nodemailer');
const residentEventsController = require('../controllers/residentEventsController');

jest.mock('../config/db');
jest.mock('nodemailer');

let mockReq, mockRes, mockSendMail;

beforeEach(() => {
    mockReq = { body: {}, params: {}, query: {} };
    mockRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
    };
    mockSendMail = jest.fn().mockImplementation((mailOptions, callback) => callback(null, true));
    const mockTransporter = { sendMail: mockSendMail };
    nodemailer.createTransport.mockReturnValue(mockTransporter);
});



describe('recordEvent', () => {
  // Test case 1: valid request body
  test('should record an event and return 201 status and the event data', async () => {
    // Arrange
    const req = {
      body: {
        eventName: 'Trồng cây xanh',
        eventDate: '2023-12-01',
        description: 'Cùng nhau trồng cây xanh cho chung cư',
        meetingId: 1,
      },
    };
    const expectedEvent = {
      id: 1,
      ...req.body,
    };
    db.execute.mockResolvedValueOnce([{ insertId: 1 }]);
    const transporter = {
      sendMail: jest.fn(),
    };
    nodemailer.createTransport.mockReturnValue(transporter);

    // Act
    await recordEvent(req, res);

    // Assert
    expect(db.execute).toBeCalledWith(
      'INSERT INTO events (event_name, event_date, description, meeting_id) VALUES (?, ?, ?, ?)',
      [
        req.body.eventName,
        req.body.eventDate,
        req.body.description,
        req.body.meetingId,
      ]
    );
    expect(nodemailer.createTransport).toBeCalledWith({
      host: 'smtp-relay.brevo.com',
      port: '587',
      auth: {
        user: 'h5studiogl@gmail.com',
        pass: 'fScdnZ4WmEDqjBA1',
      },
    });
    expect(db.execute).toBeCalledWith(
      'SELECT email FROM users WHERE role = "resident"'
    );
    expect(transporter.sendMail).toBeCalledTimes(2); // Assuming there are two residents in the database
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith(expectedEvent);
  });

  // Test case 2: missing eventName in request body
  test('should return 400 status and an error message if eventName is missing', async () => {
    // Arrange
    const req = {
      body: {
        eventDate: '2023-12-01',
        description: 'Cùng nhau trồng cây xanh cho chung cư',
        meetingId: 1,
      },
    };
    const expectedError = {
      message: 'Event name is required',
    };

    // Act
    await recordEvent(req, res);

    // Assert
    expect(db.execute).not.toBeCalled();
    expect(nodemailer.createTransport).not.toBeCalled();
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith(expectedError);
  });

  // Test case 3: missing eventDate in request body
  test('should return 400 status and an error message if eventDate is missing', async () => {
    // Arrange
    const req = {
      body: {
        eventName: 'Trồng cây xanh',
        description: 'Cùng nhau trồng cây xanh cho chung cư',
        meetingId: 1,
      },
    };
    const expectedError = {
      message: 'Event date is required',
    };

    // Act
    await recordEvent(req, res);

    // Assert
    expect(db.execute).not.toBeCalled();
    expect(nodemailer.createTransport).not.toBeCalled();
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith(expectedError);
  });

  // Test case 4: missing description in request body
  test('should return 400 status and an error message if description is missing', async () => {
    // Arrange
    const req = {
      body: {
        eventName: 'Trồng cây xanh',
        eventDate: '2023-12-01',
        meetingId: 1,
      },
    };
    const expectedError = {
      message: 'Description is required',
    };

    // Act
    await recordEvent(req, res);

    // Assert
    expect(db.execute).not.toBeCalled();
    expect(nodemailer.createTransport).not.toBeCalled();
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith(expectedError);
  });

  // Test case 5: missing meetingId in request body
  test('should return 400 status and an error message if meetingId is missing', async () => {
    // Arrange
    const req = {
      body: {
        eventName: 'Trồng cây xanh',
        eventDate: '2023-12-01',
        description: 'Cùng nhau trồng cây xanh cho chung cư',
      },
    };
    const expectedError = {
      message: 'Meeting ID is required',
    };

    // Act
    await recordEvent(req, res);

    // Assert
    expect(db.execute).not.toBeCalled();
    expect(nodemailer.createTransport).not.toBeCalled();
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith(expectedError);
  });
});

// Test the registerForMeeting function
describe('registerForMeeting', () => {
  // Test case 1: valid request body
  test('should register a user for a meeting and return 200 status and a success message', async () => {
    // Arrange
    const req = {
      body: {
        meetingId: 1,
        userId: 1,
      },
    };
    const expectedMessage = {
      message: 'Registration for meeting successful',
      status: true,
    };
    db.execute.mockResolvedValueOnce([{ length: 1 }]); // Mock meetingRows
    db.execute.mockResolvedValueOnce([{ length: 1 }]); // Mock userRows
    db.execute.mockResolvedValueOnce([{}]); // Mock meeting_participants
    const transporter = {
      sendMail: jest.fn(),
    };
    nodemailer.createTransport.mockReturnValue(transporter);

    // Act
    await registerForMeeting(req, res);

    // Assert
    expect(db.execute).toBeCalledWith(
      'SELECT * FROM meetings WHERE id = ?',
      [req.body.meetingId]
    );
    expect(db.execute).toBeCalledWith(
      'SELECT * FROM users WHERE id = ? AND role = "resident"',
      [req.body.userId]
    );
    expect(db.execute).toBeCalledWith(
      'INSERT INTO meeting_participants (meeting_id, user_id) VALUES (?, ?)',
      [req.body.meetingId, req.body.userId]
    );
    expect(nodemailer.createTransport).toBeCalledWith({
      host: 'smtp-relay.brevo.com',
      port: '587',
      auth: {
        user: 'h5studiogl@gmail.com',
        pass: 'fScdnZ4WmEDqjBA1',
      },
    });
    expect(transporter.sendMail).toBeCalledWith({
      from: 'coms@gmail.com',
      to: 'user1@gmail.com', // Assuming the user email is user1@gmail.com
      subject: 'Đăng ký tham gia cuộc họp: Họp cư dân', // Assuming the meeting title is Họp cư dân
      text: 'Bạn đã đăng ký tham gia cuộc họp "Họp cư dân" vào ngày 2023-11-30.', // Assuming the meeting date is 2023-11-30
    });
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(expectedMessage);
  });

  // Test case 2: missing meetingId in request body
  test('should return 400 status and an error message if meetingId is missing', async () => {
    // Arrange
    const req = {
      body: {
        userId: 1,
      },
    };
    const expectedError = {
      message: 'Meeting ID is required',
      status: false,
    };

    // Act
    await registerForMeeting(req, res);

    // Assert
    expect(db.execute).not.toBeCalled();
    expect(nodemailer.createTransport).not.toBeCalled();
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith(expectedError);
  });

  // Test case 3: missing userId in request body
  test('should return 400 status and an error message if userId is missing', async () => {
    // Arrange
    const req = {
      body: {
        meetingId: 1,
      },
    };
    const expectedError = {
      message: 'User ID is required',
      status: false,
    };

    // Act
    await registerForMeeting(req, res);

    // Assert
    expect(db.execute).not.toBeCalled();
    expect(nodemailer.createTransport).not.toBeCalled();
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith(expectedError);
  });

  // Test case 4: invalid meetingId in request body
  test('should return 400 status and an error message if meetingId is not found', async () => {
    // Arrange
    const req = {
      body: {
        meetingId: 999,
        userId: 1,
      },
    };
    const expectedError = {
      message: 'Invalid meeting or user',
      status: false,
    };
    db.execute.mockResolvedValueOnce([{ length: 0 }]); // Mock meetingRows

    // Act
    await registerForMeeting(req, res);

    // Assert
    expect(db.execute).toBeCalledWith(
      'SELECT * FROM meetings WHERE id = ?',
      [req.body.meetingId]
    );
    expect(db.execute).not.toBeCalledWith(
      'SELECT * FROM users WHERE id = ? AND role = "resident"',
      [req.body.userId]
    );
    expect(db.execute).not.toBeCalledWith(
      'INSERT INTO meeting_participants (meeting_id, user_id) VALUES (?, ?)',
      [req.body.meetingId, req.body.userId]
    );
    expect(nodemailer.createTransport).not.toBeCalled();
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith(expectedError);
  });

  // Test case 5: invalid userId in request body
  test('should return 400 status and an error message if userId is not found or not a resident', async () => {
    // Arrange
    const req = {
      body: {
        meetingId: 1,
        userId: 999,
      },
    };
    const expectedError = {
      message: 'Invalid meeting or user',
      status: false,
    };
    db.execute.mockResolvedValueOnce([{ length: 1 }]); // Mock meetingRows
    db.execute.mockResolvedValueOnce([{ length: 0 }]); // Mock userRows

    // Act
    await registerForMeeting(req, res);

    // Assert
    expect(db.execute).toBeCalledWith(
      'SELECT * FROM meetings WHERE id = ?',
      [req.body.meetingId]
    );
    expect(db.execute).toBeCalledWith(
      'SELECT * FROM users WHERE id = ? AND role = "resident"',
      [req.body.userId]
    );
    expect(db.execute).not.toBeCalledWith(
      'INSERT INTO meeting_participants (meeting_id, user_id) VALUES (?, ?)',
      [req.body.meetingId, req.body.userId]
    );
    expect(nodemailer.createTransport).not.toBeCalled();
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith(expectedError);
  });
});

// Test the getAllMeetings function
describe('getAllMeetings', () => {
  // Test case 1: there are some meetings in the database
  test('should return 200 status and an array of meetings', async () => {
    // Arrange
    const req = {};
    const expectedMeetings = [
      {
        id: 1,
        title: 'Họp cư dân',
        date: '2023-11-30',
        description: 'Thảo luận về các vấn đề liên quan đến chung cư',
        location: 'Sảnh chính',
      },
      {
        id: 2,
        title: 'Họp ban quản lý',
        date: '2023-12-01',
        description: 'Báo cáo tình hình hoạt động của chung cư',
        location: 'Phòng họp',
      },
    ];
    db.execute.mockResolvedValueOnce([expectedMeetings]);

    // Act
    await getAllMeetings(req, res);

    // Assert
    expect(db.execute).toBeCalledWith('SELECT * FROM meetings');
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(expectedMeetings);
  });

  // Test case 2: there are no meetings in the database
  test('should return 200 status and an empty array if there are no meetings', async () => {
    // Arrange
    const req = {};
    const expectedMeetings = [];
    db.execute.mockResolvedValueOnce([expectedMeetings]);

    // Act
    await getAllMeetings(req, res);

    // Assert
    expect(db.execute).toBeCalledWith('SELECT * FROM meetings');
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(expectedMeetings);
  });

  // Test case 3: database error
  test('should return 500 status and an error message if database query fails', async () => {
    // Arrange
    const req = {};
    const expectedError = new Error('Database error');
    db.execute.mockRejectedValueOnce(expectedError);

    // Act
    await getAllMeetings(req, res);

    // Assert
    expect(db.execute).toBeCalledWith('SELECT * FROM meetings');
    expect(res.status).toBeCalledWith(500);
    expect(res.json).toBeCalledWith(expectedError);
  });

  // Test case 4: invalid request object
  test('should return 500 status and an error message if request object is null or undefined', async () => {
    // Arrange
    const req = null;
    const expectedError = new Error('Invalid request object');

    // Act
    await getAllMeetings(req, res);

    // Assert
    expect(db.execute).not.toBeCalled();
    expect(res.status).toBeCalledWith(500);
    expect(res.json).toBeCalledWith(expectedError);
  });

  // Test case 5: invalid response object
  test('should throw an error if response object is null or undefined', async () => {
    // Arrange
    const req = {};
    const res = null;
    const expectedError = new Error('Invalid response object');

    // Act and assert
    await expect(getAllMeetings(req, res)).rejects.toThrow(expectedError);
    expect(db.execute).not.toBeCalled();
  });
});

describe('getMeetingById', () => {
  beforeEach(() => {
      mockReq.params = { meetingId: 1 };
      db.execute.mockResolvedValue([[{ /* Meeting data */ }]]);
  });

  it('should retrieve a meeting by ID', async () => {
      await residentEventsController.getMeetingById(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  // Additional test cases...
});

describe('getAllRegistrationsForMeeting', () => {
  beforeEach(() => {
      mockReq.params = { meetingId: 1 };
      db.execute.mockResolvedValue([ /* Registrations data */ ]);
  });

  it('should retrieve all registrations for a meeting', async () => {
      await residentEventsController.getAllRegistrationsForMeeting(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  // Additional test cases...
});

describe('searchMeetingsByTitle', () => {
  beforeEach(() => {
      mockReq.query = { title: 'Board' };
      db.execute.mockResolvedValue([ /* Meetings data */ ]);
  });

  it('should search meetings by title', async () => {
      await residentEventsController.searchMeetingsByTitle(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  // Additional test cases...
});


// jest.mock('../config/db');
// jest.mock('nodemailer');

// // Mock the nodemailer module
// const nodemailer = require('nodemailer');
// jest.mock('nodemailer');

// // Mock the response object
// const res = {
//   status: jest.fn().mockReturnThis(),
//   json: jest.fn().mockReturnThis(),
// };

// // Test the createMeeting function
// describe('createMeeting', () => {
//   // Test case 1: valid request body
//   test('should create a meeting and return 201 status and the meeting data', async () => {
//     // Arrange
//     const req = {
//       body: {
//         title: 'Họp cư dân',
//         date: '2023-11-30',
//         description: 'Thảo luận về các vấn đề liên quan đến chung cư',
//         location: 'Sảnh chính',
//         role: 'resident',
//       },
//     };
//     const expectedMeeting = {
//       id: 1,
//       ...req.body,
//     };
//     db.execute.mockResolvedValueOnce([{ insertId: 1 }]);
//     const transporter = {
//       sendMail: jest.fn(),
//     };
//     nodemailer.createTransport.mockReturnValue(transporter);

//     // Act
//     await createMeeting(req, res);

//     // Assert
//     expect(db.execute).toBeCalledWith(
//       'INSERT INTO meetings (title, date, description, location) VALUES (?, ?, ?, ?)',
//       [
//         req.body.title,
//         req.body.date,
//         req.body.description,
//         req.body.location,
//       ]
//     );
//     expect(nodemailer.createTransport).toBeCalledWith({
//       host: 'smtp-relay.brevo.com',
//       port: '587',
//       auth: {
//         user: 'h5studiogl@gmail.com',
//         pass: 'fScdnZ4WmEDqjBA1',
//       },
//     });
//     expect(db.execute).toBeCalledWith(
//       'SELECT * FROM users WHERE role = ?',
//       [req.body.role]
//     );
//     expect(transporter.sendMail).toBeCalledTimes(2); // Assuming there are two residents in the database
//     expect(res.status).toBeCalledWith(201);
//     expect(res.json).toBeCalledWith(expectedMeeting);
//   });

//   // Test case 2: missing title in request body
//   test('should return 400 status and an error message if title is missing', async () => {
//     // Arrange
//     const req = {
//       body: {
//         date: '2023-11-30',
//         description: 'Thảo luận về các vấn đề liên quan đến chung cư',
//         location: 'Sảnh chính',
//         role: 'resident',
//       },
//     };
//     const expectedError = {
//       message: 'Title is required',
//     };

//     // Act
//     await createMeeting(req, res);

//     // Assert
//     expect(db.execute).not.toBeCalled();
//     expect(nodemailer.createTransport).not.toBeCalled();
//     expect(res.status).toBeCalledWith(400);
//     expect(res.json).toBeCalledWith(expectedError);
//   });

//   // Test case 3: missing date in request body
//   test('should return 400 status and an error message if date is missing', async () => {
//     // Arrange
//     const req = {
//       body: {
//         title: 'Họp cư dân',
//         description: 'Thảo luận về các vấn đề liên quan đến chung cư',
//         location: 'Sảnh chính',
//         role: 'resident',
//       },
//     };
//     const expectedError = {
//       message: 'Date is required',
//     };

//     // Act
//     await createMeeting(req, res);

//     // Assert
//     expect(db.execute).not.toBeCalled();
//     expect(nodemailer.createTransport).not.toBeCalled();
//     expect(res.status).toBeCalledWith(400);
//     expect(res.json).toBeCalledWith(expectedError);
//   });

//   // Test case 4: missing description in request body
//   test('should return 400 status and an error message if description is missing', async () => {
//     // Arrange
//     const req = {
//       body: {
//         title: 'Họp cư dân',
//         date: '2023-11-30',
//         location: 'Sảnh chính',
//         role: 'resident',
//       },
//     };
//     const expectedError = {
//       message: 'Description is required',
//     };

//     // Act
//     await createMeeting(req, res);

//     // Assert
//     expect(db.execute).not.toBeCalled();
//     expect(nodemailer.createTransport).not.toBeCalled();
//     expect(res.status).toBeCalledWith(400);
//     expect(res.json).toBeCalledWith(expectedError);
//   });

//   // Test case 5: missing location in request body
//   test('should return 400 status and an error message if location is missing', async () => {
//     // Arrange
//     const req = {
//       body: {
//         title: 'Họp cư dân',
//         date: '2023-11-30',
//         description: 'Thảo luận về các vấn đề liên quan đến chung cư',
//         role: 'resident',
//       },
//     };
//     const expectedError = {
//       message: 'Location is required',
//     };

//     // Act
//     await createMeeting(req, res);

//     // Assert
//     expect(db.execute).not.toBeCalled();
//     expect(nodemailer.createTransport).not.toBeCalled();
//     expect(res.status).toBeCalledWith(400);
//     expect(res.json).toBeCalledWith(expectedError);
//   });

//   // Test case 6: missing role in request body
//   test('should return 400 status and an error message if role is missing', async () => {
//     // Arrange
//     const req = {
//       body: {
//         title: 'Họp cư dân',
//         date: '2023-11-30',
//         description: 'Thảo luận về các vấn đề liên quan đến chung cư',
//         location: 'Sảnh chính',
//       },
//     };
//     const expectedError = {
//       message: 'Role is required',
//     };

//     // Act
//     await createMeeting(req, res);

//     // Assert
//     expect(db.execute).not.toBeCalled();
//     expect(nodemailer.createTransport).not.toBeCalled();
//     expect(res.status).toBeCalledWith(400);
//     expect(res.json).toBeCalledWith(expectedError);
//   });

//   // Test case 7: invalid date format in request body
//   test('should return 400 status and an error message if date is not in YYYY-MM-DD format', async () => {
//     // Arrange
//     const req = {
//       body: {
//         title: 'Họp cư dân',
//         date: '30-11-2023',
//         description: 'Thảo luận về các vấn đề liên quan đến chung cư',
//         location: 'Sảnh chính',
//         role: 'resident',
//       },
//     };
//     const expectedError = {
//       message: 'Date must be in YYYY-MM-DD format',
//     };

//     // Act
//     await createMeeting(req, res);

//     // Assert
//     expect(db.execute).not.toBeCalled();
//     expect(nodemailer.createTransport).not.toBeCalled();
//     expect(res.status).toBeCalledWith(400);
//     expect(res.json).toBeCalledWith(expectedError);
//   });

//   // Test case 8: invalid role in request body
//   test('should return 400 status and an error message if role is not "resident" or "manager"', async () => {
//     // Arrange
//     const req = {
//       body: {
//         title: 'Họp cư dân',
//         date: '2023-11-30',
//         description: 'Thảo luận về các vấn đề liên quan đến chung cư',
//         location: 'Sảnh chính',
//         role: 'admin',
//       },
//     };
//     const expectedError = {
//       message: 'Role must be either "resident" or "manager"',
//     };

//     // Act
//     await createMeeting(req, res);

//     // Assert
//     expect(db.execute).not.toBeCalled();
//     expect(nodemailer.createTransport).not.toBeCalled();
//     expect(res.status).toBeCalledWith(400);
//     expect(res.json).toBeCalledWith(expectedError);
//   });
// });
// describe('recordEvent', () => {
//     it('records an event successfully and sends notifications', async () => {
//       // Mock successful database insertion
//       db.execute.mockResolvedValueOnce([{ insertId: 1 }, {}]);
  
//       // Mock successful user retrieval for notification
//       db.execute.mockResolvedValueOnce([[{ email: 'resident1@example.com' }, { email: 'resident2@example.com' }], {}]);
  
//       // Mock successful email sending
//       nodemailer.createTransport.mockReturnValueOnce({
//         sendMail: jest.fn().mockImplementation((options, callback) => {
//           callback(null, { response: 'Email sent successfully' });
//         }),
//       });
  
//       const req = {
//         body: {
//           eventName: 'Test Event',
//           eventDate: '2023-01-01',
//           description: 'Event description',
//           meetingId: 1,
//         },
//       };
//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };
  
//       await meetingController.recordEvent(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(201);
//       expect(res.json).toHaveBeenCalledWith({
//         message: 'Event recorded successfully',
//         eventId: 1,
//         status: true,
//       });
//     });
  
//     it('handles errors during database insertion', async () => {
//       // Mock database insertion error
//       db.execute.mockRejectedValueOnce(new Error('Database error'));
  
//       const req = {
//         body: {
//           // ... (request body)
//         },
//       };
//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };
  
//       await meetingController.recordEvent(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
//     });
  
//     it('handles errors during email sending', async () => {
//       // Mock successful database insertion
//       db.execute.mockResolvedValueOnce([{ insertId: 1 }, {}]);
  
//       // Mock successful user retrieval for notification
//       db.execute.mockResolvedValueOnce([[{ email: 'resident1@example.com' }], {}]);
  
//       // Mock email sending error
//       nodemailer.createTransport.mockReturnValueOnce({
//         sendMail: jest.fn().mockImplementation((options, callback) => {
//           callback(new Error('Email sending error'));
//         }),
//       });
  
//       const req = {
//         body: {
//           // ... (request body)
//         },
//       };
//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };
  
//       await meetingController.recordEvent(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith({ message: 'Email sending error' });
//     });
// });
// // Test the recordEvent function
// describe('recordEvent', () => {
//   // Test case 1: valid request body
//   test('should record an event and return 201 status and the event data', async () => {
//     // Arrange
//     const req = {
//       body: {
//         eventName: 'Trồng cây xanh',
//         eventDate: '2023-12-01',
//         description: 'Cùng nhau trồng cây xanh cho chung cư',
//         meetingId: 1,
//       },
//     };
//     const expectedEvent = {
//       id: 1,
//       ...req.body,
//     };
//     db.execute.mockResolvedValueOnce([{ insertId: 1 }]);
//     const transporter = {
//       sendMail: jest.fn(),
//     };
//     nodemailer.createTransport.mockReturnValue(transporter);

//     // Act
//     await recordEvent(req, res); 
//      // Assert
//     expect(db.execute).not.toBeCalled();
//     expect(nodemailer.createTransport).not.toBeCalled();
//     expect(res.status).toBeCalledWith(400);
//     expect(res.json).toBeCalledWith(expectedError);
//   });
// });