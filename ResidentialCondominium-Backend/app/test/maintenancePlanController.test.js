const db = require('../config/db');
const maintenancePlanController = require('../controllers/maintenancePlanController');

jest.mock('../config/db');

describe('maintenancePlanController', () => {
  let mockResponse;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('createMaintenancePlan', () => {
    it('should successfully create a maintenance plan', async () => {
      const planData = { asset_id: 1, plan_description: 'Plan A', start_date: '2023-01-01', end_date: '2023-12-31' };
      db.execute.mockResolvedValueOnce([{ insertId: 1 }]); // Mocking successful insertion

      const req = { body: planData };

      await maintenancePlanController.createMaintenancePlan(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'INSERT INTO maintenance_plans (asset_id, plan_description, start_date, end_date) VALUES (?, ?, ?, ?)',
        [planData.asset_id, planData.plan_description, planData.start_date, planData.end_date]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ id: 1, ...planData });
    });

    it('should handle database errors when creating a maintenance plan', async () => {
      const planData = { asset_id: 1, plan_description: 'Plan A', start_date: '2023-01-01', end_date: '2023-12-31' };
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { body: planData };

      await maintenancePlanController.createMaintenancePlan(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('updateMaintenancePlan', () => {
    it('should successfully update a maintenance plan', async () => {
      const planId = 1;
      const planData = { asset_id: 1, plan_description: 'Plan A', start_date: '2023-01-01', end_date: '2023-12-31' };
      db.execute.mockResolvedValueOnce([{}]); // Mocking successful update

      const req = { params: { id: planId }, body: planData };

      await maintenancePlanController.updateMaintenancePlan(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'UPDATE maintenance_plans SET asset_id = ?, plan_description = ?, start_date = ?, end_date = ? WHERE id = ?',
        [planData.asset_id, planData.plan_description, planData.start_date, planData.end_date, planId]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Maintenance plan updated successfully' });
    });

    it('should handle database errors when updating a maintenance plan', async () => {
      const planId = 1;
      const planData = { asset_id: 1, plan_description: 'Plan A', start_date: '2023-01-01', end_date: '2023-12-31' };
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { id: planId }, body: planData };

      await maintenancePlanController.updateMaintenancePlan(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('deleteMaintenancePlan', () => {
    it('should successfully delete a maintenance plan', async () => {
      const planId = 1;
      db.execute.mockResolvedValueOnce([{}]); // Mocking successful deletion

      const req = { params: { id: planId } };

      await maintenancePlanController.deleteMaintenancePlan(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('DELETE FROM maintenance_plans WHERE id = ?', [planId]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Maintenance plan deleted successfully' });
    });

    it('should handle database errors when deleting a maintenance plan', async () => {
      const planId = 1;
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { id: planId } };

      await maintenancePlanController.deleteMaintenancePlan(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getMaintenancePlansForAsset', () => {
    it('should successfully get maintenance plans for an asset', async () => {
      const assetId = 1;
      const mockMaintenancePlans = [{ id: 1, asset_id: 1, plan_description: 'Plan A', start_date: '2023-01-01', end_date: '2023-12-31' }];
      db.execute.mockResolvedValueOnce([mockMaintenancePlans]); // Mocking maintenance plans exist

      const req = { params: { assetId } };

      await maintenancePlanController.getMaintenancePlansForAsset(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM maintenance_plans WHERE asset_id = ?', [assetId]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockMaintenancePlans });
    });

    it('should handle database errors when getting maintenance plans for an asset', async () => {
      const assetId = 1;
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { assetId } };

      await maintenancePlanController.getMaintenancePlansForAsset(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getAllMaintenancePlans', () => {
    it('should successfully get all maintenance plans', async () => {
      const mockMaintenancePlans = [
        { id: 1, asset_id: 1, plan_description: 'Plan A', start_date: '2023-01-01', end_date: '2023-12-31' },
        { id: 2, asset_id: 2, plan_description: 'Plan B', start_date: '2023-02-01', end_date: '2023-12-31' }
      ];
      db.execute.mockResolvedValueOnce([mockMaintenancePlans]); // Mocking maintenance plans exist

      const req = {};

      await maintenancePlanController.getAllMaintenancePlans(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM maintenance_plans');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockMaintenancePlans });
    });

    it('should handle database errors when getting all maintenance plans', async () => {
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = {};

      await maintenancePlanController.getAllMaintenancePlans(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });
});