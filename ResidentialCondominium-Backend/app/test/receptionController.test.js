const db = require('../config/db');
const receptionController = require('../controllers/receptionController');

jest.mock('../config/db');

describe('receptionController', () => {
  let mockResponse;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('createReception', () => {
    it('should successfully create a reception', async () => {
      const receptionData = { resident_id: 1, guest_name: 'Guest A', entry_date: '2023-01-01', purpose: 'Visit', note: 'No note' };
      db.execute.mockResolvedValueOnce([{ insertId: 1 }]); // Mocking successful insertion

      const req = { body: receptionData };

      await receptionController.createReception(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'INSERT INTO receptions (resident_id, guest_name, entry_date, purpose, note) VALUES (?, ?, ?, ?, ?)',
        [receptionData.resident_id, receptionData.guest_name, receptionData.entry_date, receptionData.purpose, receptionData.note]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ id: 1, ...receptionData });
    });

    it('should handle database errors when creating a reception', async () => {
      const receptionData = { resident_id: 1, guest_name: 'Guest A', entry_date: '2023-01-01', purpose: 'Visit', note: 'No note' };
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { body: receptionData };

      await receptionController.createReception(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('updateReception', () => {
    it('should successfully update a reception', async () => {
      const receptionId = 1;
      const receptionData = { resident_id: 1, guest_name: 'Guest B', entry_date: '2023-02-01', purpose: 'Meeting', note: 'No note' };
      db.execute.mockResolvedValueOnce([{}]); // Mocking successful update

      const req = { params: { id: receptionId }, body: receptionData };

      await receptionController.updateReception(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'UPDATE receptions SET resident_id = ?, guest_name = ?, entry_date = ?, purpose = ?, note = ? WHERE id = ?',
        [receptionData.resident_id, receptionData.guest_name, receptionData.entry_date, receptionData.purpose, receptionData.note, receptionId]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Reception updated successfully' });
    });

    it('should handle database errors when updating a reception', async () => {
      const receptionId = 1;
      const receptionData = { resident_id: 1, guest_name: 'Guest B', entry_date: '2023-02-01', purpose: 'Meeting', note: 'No note' };
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { id: receptionId }, body: receptionData };

      await receptionController.updateReception(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('deleteReception', () => {
    it('should successfully delete a reception', async () => {
      const receptionId = 1;
      db.execute.mockResolvedValueOnce([{}]); // Mocking successful deletion

      const req = { params: { id: receptionId } };

      await receptionController.deleteReception(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('DELETE FROM receptions WHERE id = ?', [receptionId]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Reception deleted successfully' });
    });

    it('should handle database errors when deleting a reception', async () => {
      const receptionId = 1;
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { id: receptionId } };

      await receptionController.deleteReception(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getAllReceptions', () => {
    it('should successfully get all receptions', async () => {
      const mockReceptions = [
        { id: 1, resident_id: 1, guest_name: 'Guest A', entry_date: '2023-01-01', purpose: 'Visit', note: 'No note' },
        { id: 2, resident_id: 2, guest_name: 'Guest B', entry_date: '2023-02-01', purpose: 'Meeting', note: 'No note' }
      ];
      db.execute.mockResolvedValueOnce([mockReceptions]); // Mocking receptions exist

      const req = {};

      await receptionController.getAllReceptions(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM receptions');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockReceptions });
    });

    it('should handle database errors when getting all receptions', async () => {
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = {};

      await receptionController.getAllReceptions(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getReceptionById', () => {
    it('should successfully get a reception by id', async () => {
      const receptionId = 1;
      const mockReception = [{ id: 1, resident_id: 1, guest_name: 'Guest A', entry_date: '2023-01-01', purpose: 'Visit', note: 'No note' }];
      db.execute.mockResolvedValueOnce([mockReception]); // Mocking reception exists

      const req = { params: { id: receptionId } };

      await receptionController.getReceptionById(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM receptions WHERE id = ?', [receptionId]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockReception[0] });
    });

    it('should handle database errors when getting a reception by id', async () => {
      const receptionId = 1;
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { id: receptionId } };

      await receptionController.getReceptionById(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('searchReceptions', () => {
    it('should successfully search receptions', async () => {
      const query = 'Guest A';
      const mockReceptions = [
        { id: 1, resident_id: 1, guest_name: 'Guest A', entry_date: '2023-01-01', purpose: 'Visit', note: 'No note' },
        { id: 2, resident_id: 2, guest_name: 'Guest A', entry_date: '2023-02-01', purpose: 'Meeting', note: 'No note' }
      ];
      db.execute.mockResolvedValueOnce([mockReceptions]); // Mocking receptions exist

      const req = { params: { query } };

      await receptionController.searchReceptions(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'SELECT * FROM receptions WHERE guest_name LIKE ? OR purpose LIKE ? OR note LIKE ?',
        [`%${query}%`, `%${query}%`, `%${query}%`]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockReceptions });
    });

    it('should handle database errors when searching receptions', async () => {
      const query = 'Guest A';
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { query } };

      await receptionController.searchReceptions(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

});
