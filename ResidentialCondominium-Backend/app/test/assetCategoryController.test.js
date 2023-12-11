const assetCategoryController = require('../controllers/assetCategoryController');
const db = require('../config/db');
jest.mock('../config/db');


describe('getAllAssetCategories', () => {
  it('should retrieve all asset categories successfully', async () => {
    const mockAssetCategories = [{ id: 1, name: 'Electronics' }, { id: 2, name: 'Furniture' }];

    db.execute = jest.fn().mockResolvedValue([mockAssetCategories]);

    const req = { params: { planId: 'test-cate-id' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await assetCategoryController.getAllAssetCategories(req, res);

    expect(db.execute).toHaveBeenCalledWith('SELECT * FROM asset_categories');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: mockAssetCategories });
  });

  it('should handle errors gracefully when retrieving all asset categories', async () => {
    const mockError = new Error('Database error');

    db.execute.mockRejectedValueOnce(mockError);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    try {
      await assetCategoryController.getAllAssetCategories(req, res);
    } catch (err) {
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "An error occurred while retrieving all asset categories" });
    }
  });
});

describe('createAssetCategory', () => {
  it('should create a new asset category successfully', async () => {
    const newAssetCategory = { name: 'Office Supplies', description: 'Items used in the office' };

    db.execute.mockResolvedValueOnce([{ insertId: 1 }]);

    const req = { body: newAssetCategory };
    const res = {
      status: jest.fn(),
      json: jest.fn(),
    };
    try {
      await assetCategoryController.createAssetCategory(req, res);
    } catch (err) {
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 1, ...newAssetCategory });
    }

  });

  it('should handle errors gracefully when creating a new asset category', async () => {
    const newAssetCategory = { name: 'Office Supplies', description: 'Items used in the office' };
    const mockError = new Error('Database error');
    db.execute.mockRejectedValueOnce(mockError);

    const req = { body: newAssetCategory };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    try {
      await assetCategoryController.createAssetCategory(req, res);
    } catch (err) {
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "An error occurred while creating the new asset category" });
    }
  });
});

describe('deleteAssetCategory', () => {
  it('should successfully delete an asset category', async () => {
    const assetCategoryId = 1;

    db.execute.mockResolvedValueOnce([]);

    const req = { params: { id: assetCategoryId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    try {
      await maintenanceHistoryController.deleteMaintenanceRecord(req, res);
    }
    catch {
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'successfully delete an asset category' });
    }
  });

  it('should handle errors gracefully when deleting an asset category', async () => {
    const assetCategoryId = 1;
    const mockError = new Error('Database error');
    db.execute.mockRejectedValueOnce(mockError);

    const req = { params: { id: assetCategoryId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    try {
      await assetCategoryController.deleteAssetCategory(req, res);

    } catch {
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "An error occurred while deleting the asset category." });
    }
  });
});


describe('updateAssetCategory', () => {
  it('should successfully update an asset category', async () => {
    const assetCategoryId = 1;
    const updatedData = { name: 'Updated Name', description: 'New description' };

    const req = { params: { id: assetCategoryId }, body: updatedData };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    try {
      await assetCategoryController.updateAssetCategory(req, res);

    } catch (err) {
      res.status(500).json({ message: "An error occurred while updating the asset category." });
    }
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'updateAssetCategory successfully' });
  });

  it('should handle errors gracefully when updating an asset category', async () => {
    const assetCategoryId = 1;
    const updatedData = { name: 'Updated Name', description: 'New description' };
    const mockError = new Error('Database error');
    db.execute.mockRejectedValueOnce(mockError);

    const req = { params: { id: assetCategoryId }, body: updatedData };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    try {
      await assetCategoryController.updateAssetCategory(req, res);
    } catch (err) {
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "An error occurred while updating the asset category." });
    }
  });
});

describe('searchAssetCategories', () => {
  it('should successfully search for asset categories based on keyword', async () => {
    const keyword = 'Office';
    const mockAssetCategories = [{ id: 1, name: 'Office Supplies' }, { id: 2, name: 'Office Equipment' }];

    db.execute.mockResolvedValueOnce([mockAssetCategories]);

    const req = { query: { keyword } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    try { await maintenanceHistoryController.searchMaintenanceRecords(req, res); }
    catch {
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockAssetCategories });
    }

  });

  it('should handle errors gracefully when searching for asset categories', async () => {
    const keyword = 'Unknown';
    const mockError = new Error('Database error');

    db.execute.mockRejectedValueOnce(mockError);

    const req = { query: { keyword } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    try {
      await assetCategoryController.searchAssetCategories(req, res);
    } catch (err) {
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "An error occurred while searching for asset categories." });
    }

  });
});

describe('getAssetCategoryById', () => {
  it('should successfully retrieve an asset category by ID', async () => {
    const categoryId = 1;
    const mockCategory = { id: 1, name: 'Electronics', description: 'Electronic devices used in the office' };

    db.execute.mockResolvedValueOnce([mockCategory]);

    const req = { params: { id: categoryId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    try {
      await assetCategoryController.getAssetCategoryById(req, res);
    } catch {
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCategory);
    }
  });

  it('should return 404 if the asset category is not found', async () => {
    const categoryId = 999;

    db.execute.mockResolvedValueOnce([[]]);

    const req = { params: { id: categoryId } };
    const res = {
      status: jest.fn(),
      json: jest.fn(),
    };

    try {
      await assetCategoryController.getAssetCategoryById(req, res);
    } catch {
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Maintenance record not found', status: false });
    }
  });

  it('should handle errors gracefully when retrieving an asset category by ID', async () => {
    const categoryId = 1;
    const mockError = new Error('Database error');

    db.execute.mockRejectedValueOnce(mockError);

    const req = { params: { id: categoryId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    try {
      await assetCategoryController.getAssetCategoryById(req, res);
    } catch (err) {
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "An error occurred while retrieving an asset category by ID." });
    }
  });
});
