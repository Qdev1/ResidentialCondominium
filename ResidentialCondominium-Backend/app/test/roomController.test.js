const db = require('../config/db');
const roomController = require('../controllers/roomController');

jest.mock('../config/db');

describe('roomController', () => {
  let mockResponse;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('createRoom', () => {
    it('should successfully create a room', async () => {
      const mockRoom = {
        name: 'Room A',
        type: 'Meeting Room',
        area: 50,
        capacity: 10,
        status: 'Available',
        description: 'Spacious meeting room',
        residents: []
      };

      db.execute.mockResolvedValueOnce([{ insertId: 1 }]); // Mocking successful insertion

      const req = { body: mockRoom };

      await roomController.createRoom(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'INSERT INTO rooms (name, type, area, capacity, status, description) VALUES (?, ?, ?, ?, ?, ?)',
        [mockRoom.name, mockRoom.type, mockRoom.area, mockRoom.capacity, mockRoom.status, mockRoom.description]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ id: 1, ...mockRoom });
    });

    it('should handle database errors when creating a room', async () => {
      const mockRoom = {
        name: 'Room A',
        type: 'Meeting Room',
        area: 50,
        capacity: 10,
        status: 'Available',
        description: 'Spacious meeting room',
        residents: []
      };

      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { body: mockRoom };

      await roomController.createRoom(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getAllRooms', () => {
    it('should successfully get all rooms', async () => {
      const mockRooms = [{ id: 1, name: 'Room A', type: 'Meeting Room', area: 50, capacity: 10, status: 'Available', description: 'Spacious meeting room' }];
      const mockResidents = [{ username: 'John Doe', email: 'john@example.com' }];

      db.execute.mockResolvedValueOnce([mockRooms]); // Mocking rooms exist in the database
      db.execute.mockResolvedValueOnce([mockResidents]); // Mocking residents exist in the database

      const req = {};

      await roomController.getAllRooms(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT rooms.id, rooms.name, rooms.type, rooms.area, rooms.capacity, rooms.status, rooms.description FROM rooms');
      expect(db.execute).toHaveBeenCalledWith('SELECT users.username, users.email FROM users INNER JOIN room_residents ON users.id = room_residents.user_id WHERE room_residents.room_id = ?', [mockRooms[0].id]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: [{ ...mockRooms[0], residents: mockResidents }] });
    });

    it('should handle database errors when getting all rooms', async () => {
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = {};

      await roomController.getAllRooms(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('deleteRoom', () => {
    it('should successfully delete a room', async () => {
      const roomId = 1;
      db.execute.mockResolvedValueOnce([[]]); // Mocking room exists
      db.execute.mockResolvedValueOnce([{}]); // Mocking successful deletion

      const req = { params: { id: roomId } };

      await roomController.deleteRoom(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM rooms WHERE id = ?', [roomId]);
      expect(db.execute).toHaveBeenCalledWith('DELETE FROM rooms WHERE id = ?', [roomId]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith("Room deleted successfully");
    });

    it('should handle database errors when deleting a room', async () => {
      const roomId = 1;
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { id: roomId } };

      await roomController.deleteRoom(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('updateRoom', () => {
    it('should successfully update a room', async () => {
      const roomId = 1;
      const roomData = { name: 'Room A', type: 'Type A', area: 100, capacity: 4, status: 'Available', description: 'Description A' };
      db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]); // Mocking successful update

      const req = { params: { id: roomId }, body: roomData };

      await roomController.updateRoom(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'UPDATE rooms SET name = ?, type = ?, area = ?, capacity = ?, status = ?, description = ? WHERE id = ?',
        [roomData.name, roomData.type, roomData.area, roomData.capacity, roomData.status, roomData.description, roomId]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith("Room updated successfully");
    });

    it('should handle database errors when updating a room', async () => {
      const roomId = 1;
      const roomData = { name: 'Room A', type: 'Type A', area: 100, capacity: 4, status: 'Available', description: 'Description A' };
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { id: roomId }, body: roomData };

      await roomController.updateRoom(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });
  describe('searchRooms', () => {
    it('should successfully search rooms', async () => {
      const keyword = 'Room A';
      const mockRooms = [{ id: 1, name: 'Room A', type: 'Type A', area: 100, capacity: 4, status: 'Available', description: 'Description A' }];
      db.execute.mockResolvedValueOnce([mockRooms]); // Mocking rooms exist

      const req = { query: { keyword } };

      await roomController.searchRooms(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'SELECT id, name, type, area, capacity, status, description FROM rooms WHERE name LIKE ? OR type LIKE ?',
        [`%${keyword}%`, `%${keyword}%`]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockRooms });
    });

    it('should handle database errors when searching rooms', async () => {
      const keyword = 'Room A';
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { query: { keyword } };

      await roomController.searchRooms(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: mockError.message });
    });
  });

  describe('getRoomById', () => {
    it('should successfully get a room by id', async () => {
      const roomId = 1;
      const mockRoom = [{ id: 1, name: 'Room A', type: 'Type A', area: 100, capacity: 4, status: 'Available', description: 'Description A' }];
      const mockResidents = [{ username: 'User A', email: 'usera@example.com' }];
      db.execute.mockResolvedValueOnce([mockRoom]); // Mocking room exists
      db.execute.mockResolvedValueOnce([mockResidents]); // Mocking residents exist

      const req = { params: { id: roomId } };

      await roomController.getRoomById(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT rooms.id, rooms.name, rooms.type, rooms.area, rooms.capacity, rooms.status, rooms.description FROM rooms WHERE rooms.id = ?', [roomId]);
      expect(db.execute).toHaveBeenCalledWith('SELECT users.username, users.email FROM users INNER JOIN room_residents ON users.id = room_residents.user_id WHERE room_residents.room_id = ?', [roomId]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: { ...mockRoom[0], residents: mockResidents } });
    });

    it('should handle database errors when getting a room by id', async () => {
      const roomId = 1;
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { id: roomId } };

      await roomController.getRoomById(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('addResidentToRoom', () => {
    it('should successfully add a resident to a room', async () => {
      const roomId = 1;
      const userId = 1;
      db.execute.mockResolvedValueOnce([{}]); // Mocking room exists
      db.execute.mockResolvedValueOnce([{}]); // Mocking user exists
      db.execute.mockResolvedValueOnce([{}]); // Mocking successful insertion

      const req = { body: { roomId, userId } };

      await roomController.addResidentToRoom(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM rooms WHERE id = ?', [roomId]);
      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM users WHERE id = ?', [userId]);
      expect(db.execute).toHaveBeenCalledWith('INSERT INTO room_residents (room_id, user_id) VALUES (?, ?)', [roomId, userId]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Resident added to room successfully' });
    });

    it('should handle database errors when adding a resident to a room', async () => {
      const roomId = 1;
      const userId = 1;
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { body: { roomId, userId } };

      await roomController.addResidentToRoom(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('removeResidentFromRoom', () => {
    it('should successfully remove a resident from a room', async () => {
      const roomId = 1;
      const userId = 1;
      db.execute.mockResolvedValueOnce([{}]); // Mocking room exists
      db.execute.mockResolvedValueOnce([{}]); // Mocking user exists
      db.execute.mockResolvedValueOnce([{}]); // Mocking successful deletion

      const req = { body: { roomId, userId } };

      await roomController.removeResidentFromRoom(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM rooms WHERE id = ?', [roomId]);
      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM users WHERE id = ?', [userId]);
      expect(db.execute).toHaveBeenCalledWith('DELETE FROM room_residents WHERE room_id = ? AND user_id = ?', [roomId, userId]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Resident removed from room successfully' });
    });

    it('should handle database errors when removing a resident from a room', async () => {
      const roomId = 1;
      const userId = 1;
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { body: { roomId, userId } };

      await roomController.removeResidentFromRoom(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });
});