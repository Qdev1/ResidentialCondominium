const entryController = require('../controllers/entryController');
const db = require('../config/db');
jest.mock('../config/db');

describe('entryController', () => {
  let mockResponse;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('createEntryRecord', () => {
    it('should successfully create an entry record', async () => {
      const mockEntry = {
        userId: 1,
        entryTime: '2023-01-01 00:00:00',
        exitTime: '2023-01-01 01:00:00',
        building: 'Building A',
        authorized: true,
        strangerName: null
      };

      db.execute.mockResolvedValueOnce([{ insertId: 1 }]); // Mocking successful insertion

      const req = { body: mockEntry };

      await entryController.createEntryRecord(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'INSERT INTO entry_records (user_id, entry_time, exit_time, building, authorized, stranger_name) VALUES (?, ?, ?, ?, ?, ?)',
        [mockEntry.userId, mockEntry.entryTime, mockEntry.exitTime, mockEntry.building, mockEntry.authorized, mockEntry.strangerName]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ id: 1, ...mockEntry });
    });

    it('should handle database errors when creating an entry record', async () => {
      const mockEntry = {
        userId: 1,
        entryTime: '2023-01-01 00:00:00',
        exitTime: '2023-01-01 01:00:00',
        building: 'Building A',
        authorized: true,
        strangerName: null
      };

      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { body: mockEntry };

      await entryController.createEntryRecord(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getAllEntryRecords', () => {
    it('should successfully get all entry records', async () => {
      const mockEntries = [{ id: 1, user_id: 1, entry_time: '2023-01-01 00:00:00', exit_time: '2023-01-01 01:00:00', building: 'Building A', authorized: true, stranger_name: null }];
      db.execute.mockResolvedValueOnce([mockEntries]); // Mocking entries exist in the database

      const req = {};

      await entryController.getAllEntryRecords(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM entry_records');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockEntries });
    });

    it('should handle database errors when getting all entry records', async () => {
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = {};

      await entryController.getAllEntryRecords(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getEntryRecordById', () => {
    it('should successfully get an entry record by id', async () => {
      const mockEntry = [{ id: 1, user_id: 1, entry_time: '2023-01-01 00:00:00', exit_time: '2023-01-01 01:00:00', building: 'Building A', authorized: true, stranger_name: null }];
      db.execute.mockResolvedValueOnce([mockEntry]); // Mocking entry exists in the database

      const req = { params: { id: 1 } };

      await entryController.getEntryRecordById(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM entry_records WHERE id = ?', [req.params.id]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockEntry[0] });
    });

    it('should handle entry not found scenario', async () => {
      db.execute.mockResolvedValueOnce([[]]); // Simulate no entry found in MySQL database

      const req = { params: { id: 1 } };

      await entryController.getEntryRecordById(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM entry_records WHERE id = ?', [req.params.id]);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Entry record not found' });
    });

    it('should handle database errors when getting an entry by id', async () => {
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { id: 1 } };

      await entryController.getEntryRecordById(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('updateEntryRecord', () => {
    it('should successfully update an entry record', async () => {
      const mockEntry = {
        userId: 1,
        entryTime: '2023-01-01 00:00:00',
        exitTime: '2023-01-01 01:00:00',
        building: 'Building A',
        authorized: true,
        strangerName: null
      };

      db.execute.mockResolvedValueOnce([{}]); // Mocking successful update

      const req = { params: { id: 1 }, body: mockEntry };

      await entryController.updateEntryRecord(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'UPDATE entry_records SET user_id = ?, entry_time = ?, exit_time = ?, building = ?, authorized = ?, stranger_name = ? WHERE id = ?',
        [mockEntry.userId, mockEntry.entryTime, mockEntry.exitTime, mockEntry.building, mockEntry.authorized, mockEntry.strangerName, req.params.id]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Entry record updated successfully' });
    });

    it('should handle database errors when updating an entry record', async () => {
      const mockEntry = {
        userId: 1,
        entryTime: '2023-01-01 00:00:00',
        exitTime: '2023-01-01 01:00:00',
        building: 'Building A',
        authorized: true,
        strangerName: null
      };

      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { id: 1 }, body: mockEntry };

      await entryController.updateEntryRecord(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('deleteEntryRecord', () => {
    it('should successfully delete an entry record', async () => {
      db.execute.mockResolvedValueOnce([{}]); // Mocking successful deletion

      const req = { params: { id: 1 } };

      await entryController.deleteEntryRecord(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('DELETE FROM entry_records WHERE id = ?', [req.params.id]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Entry record deleted successfully' });
    });

    it('should handle database errors when deleting an entry record', async () => {
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { id: 1 } };

      await entryController.deleteEntryRecord(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('searchEntryRecords', () => {
    it('should successfully search entry records', async () => {
      const mockEntries = [{ id: 1, user_id: 1, entry_time: '2023-01-01 00:00:00', exit_time: '2023-01-01 01:00:00', building: 'Building A', authorized: true, stranger_name: null }];
      db.execute.mockResolvedValueOnce([mockEntries]); // Mocking entries exist in the database

      const req = { params: { queryParam: 'Building A' } };

      await entryController.searchEntryRecords(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'SELECT * FROM entry_records WHERE user_id LIKE ? OR building LIKE ? OR stranger_name LIKE ?',
        [`%${req.params.queryParam}%`, `%${req.params.queryParam}%`, `%${req.params.queryParam}%`]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockEntries });
    });

    it('should handle database errors when searching entry records', async () => {
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { queryParam: 'Building A' } };

      await entryController.searchEntryRecords(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });
});