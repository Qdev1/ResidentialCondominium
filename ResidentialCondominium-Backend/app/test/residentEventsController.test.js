const db = require('../config/db');
const nodemailer = require('nodemailer');
const residentEventsController = require('../controllers/residentEventsController');

jest.mock('../config/db');
jest.mock('nodemailer');

describe('residentEventsController', () => {
  let mockResponse;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('getAllMeetingAndComplaint', () => {
    it('should successfully get all meetings and complaints', async () => {
      const mockComplaints = [{ id: 1, description: 'Complaint A' }];
      const mockEvents = [{ id: 1, title: 'Event A' }];
      db.execute.mockResolvedValueOnce([mockComplaints]); // Mocking complaints exist
      db.execute.mockResolvedValueOnce([mockEvents]); // Mocking events exist

      const req = {};

      await residentEventsController.getAllMeetingAndComplaint(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM complaints');
      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM events');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ complaints: mockComplaints, residentEvents: mockEvents });
    });

    it('should handle database errors when getting all meetings and complaints', async () => {
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = {};

      await residentEventsController.getAllMeetingAndComplaint(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('createMeeting', () => {
    it('should successfully create a meeting', async () => {
      const meetingData = { title: 'Meeting A', date: '2023-01-01', description: 'Description A', location: 'Location A', role: 'resident' };
      const mockUsers = [{ id: 1, email: 'userA@example.com' }, { id: 2, email: 'userB@example.com' }];
      db.execute.mockResolvedValueOnce([{ insertId: 1 }]); // Mocking successful insertion
      db.execute.mockResolvedValueOnce([mockUsers]); // Mocking users exist
      nodemailer.createTransport = jest.fn().mockReturnValue({
        sendMail: jest.fn().mockImplementation((mailOptions, callback) => callback(null, true)),
      });

      const req = { body: meetingData };

      await residentEventsController.createMeeting(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'INSERT INTO meetings (title, date, description, location) VALUES (?, ?, ?, ?)',
        [meetingData.title, meetingData.date, meetingData.description, meetingData.location]
      );
      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM users WHERE role = ?', [meetingData.role]);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Meeting created successfully', meetingId: 1, status: true });
    });

    it('should handle database errors when creating a meeting', async () => {
      const meetingData = { title: 'Meeting A', date: '2023-01-01', description: 'Description A', location: 'Location A', role: 'resident' };
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { body: meetingData };

      await residentEventsController.createMeeting(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });
  describe('recordEvent', () => {
    it('should successfully record an event', async () => {
      const eventData = { eventName: 'Event A', eventDate: '2023-01-01', description: 'Description A', meetingId: 1 };
      const mockUsers = [{ id: 1, email: 'userA@example.com' }, { id: 2, email: 'userB@example.com' }];
      db.execute.mockResolvedValueOnce([{ insertId: 1 }]); // Mocking successful insertion
      db.execute.mockResolvedValueOnce([mockUsers]); // Mocking users exist
      nodemailer.createTransport = jest.fn().mockReturnValue({
        sendMail: jest.fn().mockImplementation((mailOptions, callback) => callback(null, true)),
      });

      const req = { body: eventData };

      await residentEventsController.recordEvent(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'INSERT INTO events (event_name, event_date, description, meeting_id) VALUES (?, ?, ?, ?)',
        [eventData.eventName, eventData.eventDate, eventData.description, eventData.meetingId]
      );
      expect(db.execute).toHaveBeenCalledWith('SELECT email FROM users WHERE role = "resident"');
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Event recorded successfully', eventId: 1, status: true });
    });

    it('should handle database errors when recording an event', async () => {
      const eventData = { eventName: 'Event A', eventDate: '2023-01-01', description: 'Description A', meetingId: 1 };
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { body: eventData };

      await residentEventsController.recordEvent(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getAllEventsByMeetingId', () => {
    it('should successfully get all events by meeting id', async () => {
      const meetingId = 1;
      const mockEvents = [{ id: 1, meeting_id: 1, event_name: 'Event A', event_date: '2023-01-01', description: 'Description A' }];
      db.execute.mockResolvedValueOnce([mockEvents]); // Mocking events exist

      const req = { params: { meetingId } };

      await residentEventsController.getAllEventsByMeetingId(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM events WHERE meeting_id = ?', [meetingId]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockEvents });
    });

    it('should handle database errors when getting all events by meeting id', async () => {
      const meetingId = 1;
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { meetingId } };

      await residentEventsController.getAllEventsByMeetingId(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('registerForMeeting', () => {
    it('should successfully register for a meeting', async () => {
      const meetingData = { meetingId: 1, userId: 1 };
      const mockMeeting = [{ id: 1, title: 'Meeting A', date: '2023-01-01', description: 'Description A', location: 'Location A' }];
      const mockUser = [{ id: 1, email: 'userA@example.com', role: 'resident' }];
      db.execute.mockResolvedValueOnce([mockMeeting]); // Mocking meeting exists
      db.execute.mockResolvedValueOnce([mockUser]); // Mocking user exists
      db.execute.mockResolvedValueOnce([{}]); // Mocking successful insertion
      nodemailer.createTransport = jest.fn().mockReturnValue({
        sendMail: jest.fn().mockImplementation((mailOptions, callback) => callback(null, true)),
      });

      const req = { body: meetingData };

      await residentEventsController.registerForMeeting(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM meetings WHERE id = ?', [meetingData.meetingId]);
      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM users WHERE id = ? AND role = "resident"', [meetingData.userId]);
      expect(db.execute).toHaveBeenCalledWith('INSERT INTO meeting_participants (meeting_id, user_id) VALUES (?, ?)', [meetingData.meetingId, meetingData.userId]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Registration for meeting successful', status: true });
    });

    it('should handle database errors when registering for a meeting', async () => {
      const meetingData = { meetingId: 1, userId: 1 };
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { body: meetingData };

      await residentEventsController.registerForMeeting(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getMeetingById', () => {
    it('should successfully get a meeting by id', async () => {
      const meetingId = 1;
      const mockMeeting = [{ id: 1, title: 'Meeting A', date: '2023-01-01', description: 'Description A', location: 'Location A' }];
      const mockEvents = [{ id: 1, meeting_id: 1, event_name: 'Event A', event_date: '2023-01-01', description: 'Description A' }];
      db.execute.mockResolvedValueOnce([mockMeeting]); // Mocking meeting exists
      db.execute.mockResolvedValueOnce([mockEvents]); // Mocking events exist

      const req = { params: { meetingId } };

      await residentEventsController.getMeetingById(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM meetings WHERE id = ?', [meetingId]);
      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM events WHERE meeting_id = ?', [meetingId]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ ...mockMeeting[0], events: mockEvents });
    });

    it('should handle database errors when getting a meeting by id', async () => {
      const meetingId = 1;
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { meetingId } };

      await residentEventsController.getMeetingById(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getAllRegistrationsForMeeting', () => {
    it('should successfully get all registrations for a meeting', async () => {
      const meetingId = 1;
      const mockRegistrations = [{ username: 'User A', email: 'userA@example.com' }, { username: 'User B', email: 'userB@example.com' }];
      db.execute.mockResolvedValueOnce([mockRegistrations]); // Mocking registrations exist

      const req = { params: { meetingId } };

      await residentEventsController.getAllRegistrationsForMeeting(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'SELECT users.username, users.email FROM meeting_participants INNER JOIN users ON meeting_participants.user_id = users.id WHERE meeting_participants.meeting_id = ?',
        [meetingId]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockRegistrations);
    });

    it('should handle database errors when getting all registrations for a meeting', async () => {
      const meetingId = 1;
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { meetingId } };

      await residentEventsController.getAllRegistrationsForMeeting(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('searchMeetingsByTitle', () => {
    it('should successfully search meetings by title', async () => {
      const title = 'Meeting A';
      const mockMeetings = [{ id: 1, title: 'Meeting A', date: '2023-01-01', description: 'Description A', location: 'Location A' }];
      db.execute.mockResolvedValueOnce([mockMeetings]); // Mocking meetings exist

      const req = { query: { title } };

      await residentEventsController.searchMeetingsByTitle(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM meetings WHERE title LIKE ?', [`%${title}%`]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockMeetings);
    });

    it('should handle database errors when searching meetings by title', async () => {
      const title = 'Meeting A';
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { query: { title } };

      await residentEventsController.searchMeetingsByTitle(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

});
