
const db = require('../config/db');
const maintenanceHistoryController = require('../controllers/maintenanceHistoryController');

jest.mock('../config/db');

describe('createMaintenanceRecord', () => {
  it('should create a maintenance record', async () => {
    const assetId = 1;
    const description = 'Repaired broken window';
    const date = '2023-12-01';
    const cost = 100;
    const mockResult = { insertId: 1 };
    db.execute.mockResolvedValueOnce([mockResult]);

    const req = { body: { asset_id: assetId, description, date, cost } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    try {
      await maintenanceHistoryController.createMaintenanceRecord(req, res);
    } catch (err) {
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: mockResult.insertId, asset_id: assetId, description, date, cost });
    }
  });


  it('should handle errors gracefully when creating a record', async () => {
    const mockError = new Error('Database error');
    db.execute.mockRejectedValueOnce(mockError);

    const req = { body: { description: 'Missing required fields' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    try {
      await maintenanceHistoryController.createMaintenanceRecord(req, res);
    } catch (err) {
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "An error occurred while creating a maintenance record." });
    }
  });
});


describe('updateMaintenanceRecord', () => {
  it('should update a maintenance record', async () => {
    const recordId = 1;
    const assetId = 1;
    const description = 'Repaired roof leak';
    const date = '2023-12-01';
    const cost = 200;

    const req = { params: { id: recordId }, body: { asset_id: assetId, description, date, cost } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    try {
      await maintenanceHistoryController.createMaintenanceRecord(req, res);
    } catch (err) {
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Maintenance record updated successfully' });
    }
  });


  it('should handle errors gracefully when creating a record', async () => {
    const mockError = new Error('Database error');
    db.execute.mockRejectedValueOnce(mockError);

    const req = { body: { description: 'Invalid record ID' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    try {
      await maintenanceHistoryController.createMaintenanceRecord(req, res);
    } catch (err) {
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "An error occurred while updating the maintenance record." });
    }
  });
});

describe('deleteMaintenanceRecord', () => {
  it('should delete a maintenance record', async () => {
    const recordId = 1;

    const req = { params: { id: recordId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    try {
      await maintenanceHistoryController.deleteMaintenanceRecord(req, res);

    }
    catch {
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Maintenance record deleted successfully' });
    }
  });

  it('should handle errors gracefully when deleting a record', async () => {
    const mockError = new Error('Database error');
    db.execute.mockRejectedValueOnce(mockError);

    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    try {
      await maintenanceHistoryController.createMaintenanceRecord(req, res);
    } catch (err) {
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "An error occurred while deleting the maintenance record." });
    }
  });
});
describe('searchMaintenanceRecords', () => {
  it('should return maintenance records', async () => {
    const keyword = 'Repaired';
    const mockMaintenanceRecords = [{ id: 1, name: 'Test Record' }];
    db.execute.mockResolvedValueOnce([mockMaintenanceRecords]);

    const req = { query: { keyword } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    try { await maintenanceHistoryController.searchMaintenanceRecords(req, res); }
    catch {
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockMaintenanceRecords });
    }

  });

  it('should handle errors gracefully when searching records', async () => {
    const mockError = new Error('Database error');
    db.execute.mockRejectedValueOnce(mockError);

    const req = { query: { keyword: 'Invalid keyword' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    try {
      await maintenanceHistoryController.createMaintenanceRecord(req, res);
    } catch (err) {
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "An error occurred while searching the maintenance records" });
    }
  });
});


describe('getMaintenanceRecordById', () => {
  it('should find a maintenance record by ID', async () => {
    const recordId = 1;
    const mockMaintenanceRecord = { id: 1, description: 'Replaced broken window' };
    db.execute.mockResolvedValueOnce([mockMaintenanceRecord]);

    const req = { params: { id: recordId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    try {
      await maintenanceHistoryController.getMaintenanceRecordById(req, res);
    }

    catch {
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockMaintenanceRecord);
    }

  });

  it('should return a 404 if the record is not found', async () => {
    const recordId = 1;
    db.execute.mockResolvedValueOnce([]);

    const req = { params: { id: recordId } };
    const res = {
      status: jest.fn(),
      json: jest.fn(),
    };
    try {
      await maintenanceHistoryController.createMaintenanceRecord(req, res);
    } catch  {
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Maintenance record not found', status: false });
    }
  });

  it('should handle errors gracefully when fetching a record', async () => {
    const recordId = 1;
    const mockError = new Error('Database error');
    db.execute.mockRejectedValueOnce(mockError);

    const req = { params: { id: recordId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    try {
      await maintenanceHistoryController.createMaintenanceRecord(req, res);
    } catch (err) {
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "An error occurred while fetching the maintenance record" });
    }
  });
});

describe('getMaintenanceRecordsForPlan', () => {
  it('should return maintenance records successfully', async () => {
    // Mock req and res
    const req = { params: { planId: 'test-plan-id' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mock database response
    const mockMaintenanceRecords = [{ id: 1, name: 'Test Record' }];
    db.execute = jest.fn().mockResolvedValue([mockMaintenanceRecords]);

    // Call the function
    await maintenanceHistoryController.getMaintenanceRecordsForPlan(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: mockMaintenanceRecords });
  });

  it('should handle errors gracefully when creating a record', async () => {
    const mockError = new Error('Database error');
    db.execute.mockRejectedValueOnce(mockError);

    const req = { body: { description: 'Missing required fields' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    try {
      await maintenanceHistoryController.createMaintenanceRecord(req, res);
    } catch (err) {
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "An error occurred while creating a maintenance record." });
    }
  });
});
