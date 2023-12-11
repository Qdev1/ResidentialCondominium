// Import the assetController module and mock the db module
const assetController = require('../controllers/assetController');
const db = require('../config/db');
jest.mock('../config/db');

describe('getAllAssets', () => {
  it('should successfully retrieve all assets', async () => {
    const mockAssets = [{ id: 1, name: 'Asset 1' }, { id: 2, name: 'Asset 2' }];

    db.execute.mockResolvedValueOnce([mockAssets]);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    try {
        await assetController.getAllAssets(req, res);
    } catch (err) {
        res.status(500).json({ message: "An error occurred while retrieving all assets." });
    }

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: mockAssets });
  });
});

describe('createAsset', () => {
  it('should successfully create a new asset', async () => {
    const newAsset = { name: 'New Asset', description: 'New asset description', value: 100, location: 'Office', status: 'Active', categoryId: 1, quantity: 1 };

    db.execute.mockResolvedValueOnce([{ insertId: 1 }]);

    const req = { body: newAsset };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    try {
        await assetController.createAsset(req, res);
    } catch (err) {
        res.status(500).json({ message: "An error occurred while creating the new asset." });
    }

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 1, ...newAsset });
  });
});

describe('updateAsset', () => {
  it('should successfully update an asset', async () => {
    const assetId = 1;
    const updatedData = { name: 'Updated Name', description: 'New description', value: 100, location: 'Office', status: 'Active', categoryId: 1 };

    db.execute.mockResolvedValueOnce([]);

    const req = { params: { id: assetId }, body: updatedData };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    try {
        await assetController.updateAsset(req, res);
    } catch (err) {
        res.status(500).json({ message: "An error occurred while updating the asset." });
    }

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Asset updated successfully' });
  });
});

describe('deleteAsset', () => {
  it('should successfully delete an asset', async () => {
    const assetId = 1;

    db.execute.mockResolvedValueOnce([]);

    const req = { params: { id: assetId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    try {
        await assetController.deleteAsset(req, res);
    } catch (err) {
        res.status(500).json({ message: "An error occurred while deleting the asset." });
    }

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Asset deleted successfully' });
  });
});

describe('getAssetById', () => {
  it('should successfully retrieve an asset by ID', async () => {
    const assetId = 1;
    const mockAsset = { id: 1, name: 'Asset 1', description: 'Asset description', value: 100, location: 'Office', status: 'Active', categoryId: 1 };

    db.execute.mockResolvedValueOnce([mockAsset]);

    const req = { params: { id: assetId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    try {
        await assetController.getAssetById(req, res);
    } catch (err) {
        res.status(500).json({ message: "An error occurred while retrieving the asset by ID." });
    }

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: mockAsset });
  });
});

describe('searchAssets', () => {
  it('should successfully search for assets based on keyword', async () => {
    const keyword = 'Office';
    const mockAssets = [{ id: 1, name: 'Office Supplies' }, { id: 2, name: 'Office Equipment' }];

    db.execute.mockResolvedValueOnce([mockAssets]);

    const req = { query: { keyword } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    try {
        await assetController.searchAssets(req, res);
    } catch (err) {
        res.status(500).json({ message: "An error occurred while searching for assets." });
    }

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: mockAssets });
  });
});