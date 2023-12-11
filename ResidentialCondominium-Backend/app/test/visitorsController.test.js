const db = require('../config/db');
const visitorsController = require('../controllers/visitorsController');

jest.mock('../config/db');

describe('visitorsController', () => {
  let mockResponse;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('getAllVisitors', () => {
    it('should successfully get all visitors', async () => {
      const mockVisitors = [{ id: 1, name: 'Visitor A', email: 'visitorA@example.com', phone: '1234567890', entryDate: '2023-01-01', reasonToVisit: 'Reason A', citizenId: '123456789' }];
      db.execute.mockResolvedValueOnce([mockVisitors]); // Mocking visitors exist

      const req = {};

      await visitorsController.getAllVisitors(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM visitors');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockVisitors);
    });

    it('should handle database errors when getting all visitors', async () => {
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = {};

      await visitorsController.getAllVisitors(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('addVisitor', () => {
    it('should successfully add a visitor', async () => {
      const visitorData = { name: 'Visitor A', email: 'visitorA@example.com', phone: '1234567890', entryDate: '2023-01-01', reasonToVisit: 'Reason A', citizenId: '123456789' };
      db.execute.mockResolvedValueOnce([{}]); // Mocking successful insertion

      const req = { body: visitorData };

      await visitorsController.addVisitor(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'INSERT INTO visitors (name, email, phone, entryDate, reasonToVisit, citizenId) VALUES (?, ?, ?, ?, ?, ?)',
        [visitorData.name, visitorData.email, visitorData.phone, visitorData.entryDate, visitorData.reasonToVisit, visitorData.citizenId]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Visitor added successfully', status: true });
    });

    it('should handle database errors when adding a visitor', async () => {
      const visitorData = { name: 'Visitor A', email: 'visitorA@example.com', phone: '1234567890', entryDate: '2023-01-01', reasonToVisit: 'Reason A', citizenId: '123456789' };
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { body: visitorData };

      await visitorsController.addVisitor(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('updateVisitor', () => {
    it('should successfully update a visitor', async () => {
      const visitorId = 1;
      const visitorData = { name: 'Visitor A', email: 'visitorA@example.com', phone: '1234567890', entryDate: '2023-01-01', reasonToVisit: 'Reason A', citizenId: '123456789' };
      db.execute.mockResolvedValueOnce([{}]); // Mocking successful update

      const req = { params: { visitorId }, body: visitorData };

      await visitorsController.updateVisitor(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'UPDATE visitors SET name = ?, email = ?, phone = ?, entryDate = ?, reasonToVisit = ?, citizenId = ? WHERE id = ?',
        [visitorData.name, visitorData.email, visitorData.phone, visitorData.entryDate, visitorData.reasonToVisit, visitorData.citizenId, visitorId]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Visitor updated successfully', status: true });
    });

    it('should handle database errors when updating a visitor', async () => {
      const visitorId = 1;
      const visitorData = { name: 'Visitor A', email: 'visitorA@example.com', phone: '1234567890', entryDate: '2023-01-01', reasonToVisit: 'Reason A', citizenId: '123456789' };
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { visitorId }, body: visitorData };

      await visitorsController.updateVisitor(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('deleteVisitor', () => {
    it('should successfully delete a visitor', async () => {
      const visitorId = 1;
      db.execute.mockResolvedValueOnce([{}]); // Mocking successful deletion

      const req = { params: { visitorId } };

      await visitorsController.deleteVisitor(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('DELETE FROM visitors WHERE id = ?', [visitorId]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Visitor deleted successfully', status: true });
    });

    it('should handle database errors when deleting a visitor', async () => {
      const visitorId = 1;
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { visitorId } };

      await visitorsController.deleteVisitor(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });
  describe('getVisitorById', () => {
    it('should successfully get a visitor by id', async () => {
      const visitorId = 1;
      const mockVisitor = [{ id: 1, name: 'Visitor A', email: 'visitorA@example.com', phone: '1234567890', entryDate: '2023-01-01', reasonToVisit: 'Reason A', citizenId: '123456789' }];
      db.execute.mockResolvedValueOnce([mockVisitor]); // Mocking visitor exists

      const req = { params: { visitorId } };

      await visitorsController.getVisitorById(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM visitors WHERE id = ?', [visitorId]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockVisitor[0]);
    });

    it('should handle database errors when getting a visitor by id', async () => {
      const visitorId = 1;
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { visitorId } };

      await visitorsController.getVisitorById(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('searchVisitorsByCitizenId', () => {
    it('should successfully search visitors by citizen id', async () => {
      const citizenId = '123456789';
      const mockVisitors = [{ id: 1, name: 'Visitor A', email: 'visitorA@example.com', phone: '1234567890', entryDate: '2023-01-01', reasonToVisit: 'Reason A', citizenId: '123456789' }];
      db.execute.mockResolvedValueOnce([mockVisitors]); // Mocking visitors exist

      const req = { query: { citizenId } };

      await visitorsController.searchVisitorsByCitizenId(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM visitors WHERE citizen_id = ?', [citizenId]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockVisitors);
    });

    it('should handle database errors when searching visitors by citizen id', async () => {
      const citizenId = '123456789';
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { query: { citizenId } };

      await visitorsController.searchVisitorsByCitizenId(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });
});