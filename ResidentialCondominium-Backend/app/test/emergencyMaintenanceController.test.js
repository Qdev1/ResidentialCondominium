const db = require('../config/db');
const emergencyMaintenanceController = require('../controllers/emergencyMaintenanceController');

jest.mock('../config/db');
describe('emergencyMaintenanceController', () => {
  let mockResponse;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('getAllSecurityUsers', () => {
    it('should successfully get all security users', async () => {
      const mockUsers = [{ id: 1, name: 'John Doe', email: 'john@example.com', role: 'isSecurity' }];
      db.execute.mockResolvedValueOnce([mockUsers]); // Mocking users exist in the database

      const req = {};

      await emergencyMaintenanceController.getAllSecurityUsers(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM users WHERE role = "isSecurity"');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockUsers });
    });

    it('should handle database errors when getting all security users', async () => {
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = {};

      await emergencyMaintenanceController.getAllSecurityUsers(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('createEmergencyMaintenance', () => {
    it('should successfully create an emergency maintenance', async () => {
      const mockMaintenance = {
        asset_id: 1,
        description: 'Broken pipe',
        reported_by: 1
      };

      db.execute.mockResolvedValueOnce([{ insertId: 1 }]); // Mocking successful insertion

      const req = { body: mockMaintenance };

      await emergencyMaintenanceController.createEmergencyMaintenance(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'INSERT INTO emergency_maintenance (asset_id, description, reported_by) VALUES (?, ?, ?)',
        [mockMaintenance.asset_id, mockMaintenance.description, mockMaintenance.reported_by]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ id: 1, ...mockMaintenance });
    });

    it('should handle database errors when creating an emergency maintenance', async () => {
      const mockMaintenance = {
        asset_id: 1,
        description: 'Broken pipe',
        reported_by: 1
      };

      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { body: mockMaintenance };

      await emergencyMaintenanceController.createEmergencyMaintenance(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('updateEmergencyMaintenance', () => {
    it('should successfully update an emergency maintenance', async () => {
      const mockMaintenance = {
        resolved_description: 'Pipe fixed',
        resolved_by: 1
      };

      db.execute.mockResolvedValueOnce([{}]); // Mocking successful update

      const req = { params: { id: 1 }, body: mockMaintenance };

      await emergencyMaintenanceController.updateEmergencyMaintenance(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'UPDATE emergency_maintenance SET resolved_description = ?, resolved_by = ?, status = "resolved", resolved_at = CURRENT_TIMESTAMP WHERE id = ?',
        [mockMaintenance.resolved_description, mockMaintenance.resolved_by, req.params.id]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Emergency maintenance resolved successfully' });
    });

    it('should handle database errors when updating an emergency maintenance', async () => {
      const mockMaintenance = {
        resolved_description: 'Pipe fixed',
        resolved_by: 1
      };

      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { id: 1 }, body: mockMaintenance };

      await emergencyMaintenanceController.updateEmergencyMaintenance(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('deleteEmergencyMaintenance', () => {
    it('should successfully delete an emergency maintenance', async () => {
      db.execute.mockResolvedValueOnce([{}]); // Mocking successful deletion

      const req = { params: { id: 1 } };

      await emergencyMaintenanceController.deleteEmergencyMaintenance(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('DELETE FROM emergency_maintenance WHERE id = ?', [req.params.id]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Emergency maintenance record deleted successfully' });
    });

    it('should handle database errors when deleting an emergency maintenance', async () => {
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { id: 1 } };

      await emergencyMaintenanceController.deleteEmergencyMaintenance(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });
  describe('getEmergencyMaintenanceById', () => {
    it('should successfully get an emergency maintenance by id', async () => {
      const mockMaintenance = [{ id: 1, asset_id: 1, description: 'Broken pipe', reported_by: 1, resolved_description: 'Pipe fixed', resolved_by: 2, status: 'resolved', reported_at: '2023-01-01 00:00:00', resolved_at: '2023-01-02 00:00:00' }];
      db.execute.mockResolvedValueOnce([mockMaintenance]); // Mocking maintenance exists in the database

      const req = { params: { id: 1 } };

      await emergencyMaintenanceController.getEmergencyMaintenanceById(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM emergency_maintenance WHERE id = ?', [req.params.id]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockMaintenance[0] });
    });

    it('should handle maintenance not found scenario', async () => {
      db.execute.mockResolvedValueOnce([[]]); // Simulate no maintenance found in MySQL database

      const req = { params: { id: 1 } };

      await emergencyMaintenanceController.getEmergencyMaintenanceById(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM emergency_maintenance WHERE id = ?', [req.params.id]);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Emergency maintenance record not found' });
    });

    it('should handle database errors when getting a maintenance by id', async () => {
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { id: 1 } };

      await emergencyMaintenanceController.getEmergencyMaintenanceById(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getAllEmergencyMaintenance', () => {
    it('should successfully get all emergency maintenance', async () => {
      const mockMaintenances = [{ id: 1, asset_id: 1, description: 'Broken pipe', reported_by: 1, resolved_description: 'Pipe fixed', resolved_by: 2, status: 'resolved', reported_at: '2023-01-01 00:00:00', resolved_at: '2023-01-02 00:00:00' }];
      db.execute.mockResolvedValueOnce([mockMaintenances]); // Mocking maintenances exist in the database

      const req = {};

      await emergencyMaintenanceController.getAllEmergencyMaintenance(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM emergency_maintenance');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockMaintenances });
    });

    it('should handle database errors when getting all emergency maintenance', async () => {
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = {};

      await emergencyMaintenanceController.getAllEmergencyMaintenance(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('searchEmergencyMaintenance', () => {
    it('should successfully search emergency maintenance', async () => {
      const mockMaintenances = [{ id: 1, asset_id: 1, description: 'Broken pipe', reported_by: 1, resolved_description: 'Pipe fixed', resolved_by: 2, status: 'resolved', reported_at: '2023-01-01 00:00:00', resolved_at: '2023-01-02 00:00:00' }];
      db.execute.mockResolvedValueOnce([mockMaintenances]); // Mocking maintenances exist in the database

      const req = { query: { keyword: 'pipe' } };

      await emergencyMaintenanceController.searchEmergencyMaintenance(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'SELECT * FROM emergency_maintenance WHERE description LIKE ? OR resolved_description LIKE ?',
        [`%${req.query.keyword}%`, `%${req.query.keyword}%`]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockMaintenances });
    });

    it('should handle database errors when searching emergency maintenance', async () => {
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { query: { keyword: 'pipe' } };

      await emergencyMaintenanceController.searchEmergencyMaintenance(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });
  
});
