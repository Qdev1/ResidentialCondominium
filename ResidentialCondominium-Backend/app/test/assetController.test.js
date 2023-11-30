// Import the assetController module and mock the db module
const assetController = require('../controllers/assetController');
const db = require('../config/db');
jest.mock('../config/db');

// Create some mock data for assets and asset categories
const mockAssets = [
    { id: 1, name: 'Laptop', description: 'A Dell laptop', value: 1000, location: 'Office', status: 'Available', category_id: 1, category_name: 'Electronics' },
    { id: 2, name: 'Chair', description: 'A wooden chair', value: 50, location: 'Office', status: 'Available', category_id: 2, category_name: 'Furniture' },
    { id: 3, name: 'Printer', description: 'A HP printer', value: 500, location: 'Office', status: 'Broken', category_id: 1, category_name: 'Electronics' }
];

// Create a mock request and response object
const mockRequest = () => {
    return {};
};

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

// Test the getAllAssets function
describe('assetController.getAllAssets', () => {
    test('should return status 200 and all assets data', async () => {
        // Arrange
        const req = mockRequest();
        const res = mockResponse();
        const query = 'SELECT assets.*, asset_categories.name AS category_name FROM assets LEFT JOIN asset_categories ON assets.category_id = asset_categories.id';
        db.execute.mockResolvedValue([mockAssets]); // Mock the db.execute function to return the mock assets data

        // Act
        await assetController.getAllAssets(req, res);

        // Assert
        expect(db.execute).toHaveBeenCalledWith(query); // Check if the db.execute function was called with the correct query
        expect(res.status).toHaveBeenCalledWith(200); // Check if the response status was set to 200
        expect(res.json).toHaveBeenCalledWith({ data: mockAssets }); // Check if the response json was set to the mock assets data
    });

    test('should return status 500 and error message if db.execute fails', async () => {
        // Arrange
        const req = mockRequest();
        const res = mockResponse();
        const query = 'SELECT assets.*, asset_categories.name AS category_name FROM assets LEFT JOIN asset_categories ON assets.category_id = asset_categories.id';
        const error = new Error('Database error'); // Mock an error object
        db.execute.mockRejectedValue(error); // Mock the db.execute function to reject with the error object

        // Act
        await assetController.getAllAssets(req, res);

        // Assert
        expect(db.execute).toHaveBeenCalledWith(query); // Check if the db.execute function was called with the correct query
        expect(res.status).toHaveBeenCalledWith(500); // Check if the response status was set to 500
        expect(res.json).toHaveBeenCalledWith(error); // Check if the response json was set to the error object
    });
});
describe('createAsset', () => {
  it('creates a new asset with valid input', async () => {
    const req = {
      body: {
        name: 'New Asset',
        description: 'Description',
        value: 1000,
        location: 'Office',
        status: 'Active',
        categoryId: 1,
        quantity: 1,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    db.execute.mockResolvedValueOnce([{}, { insertId: 1 }]);

    await assetController.createAsset(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      name: 'New Asset',
      description: 'Description',
      value: 1000,
      location: 'Office',
      status: 'Active',
      categoryId: 1,
      quantity: 1,
    });
  });

  it('handles errors gracefully', async () => {
    const req = {
      body: {
        // Missing required fields
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    db.execute.mockRejectedValueOnce(new Error('Database error'));

    await assetController.createAsset(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });

  it('handles missing required fields', async () => {
    const req = {
      body: {
        // Missing required fields
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await assetController.createAsset(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
  });
  // Add more test cases for validation, duplicate creation, etc.
});

describe('updateAsset', () => {
  it('updates an existing asset with valid input', async () => {
    const req = {
      params: {
        id: 1,
      },
      body: {
        name: 'Updated Asset',
        description: 'Updated Description',
        value: 1500,
        location: 'Storage',
        status: 'Inactive',
        categoryId: 2,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    db.execute.mockResolvedValueOnce([{}, {}]);

    await assetController.updateAsset(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Asset updated successfully' });
  });

  it('handles errors gracefully', async () => {
    const req = {
      params: {
        id: 1,
      },
      body: {
        // Missing required fields
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    db.execute.mockRejectedValueOnce(new Error('Database error'));

    await assetController.updateAsset(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
  // Add more test cases for non-existent asset, validation, etc.
  it('handles missing required fields', async () => {
    const req = {
      params: {
        id: 1,
      },
      body: {
        // Missing required fields
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await assetController.updateAsset(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
  });

  // Add more test cases for non-existent asset, validation, etc.

});

describe('deleteAsset', () => {
  it('deletes an existing asset', async () => {
    const req = {
      params: {
        id: 1,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    db.execute.mockResolvedValueOnce([{}, {}]);

    await assetController.deleteAsset(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Asset deleted successfully' });
  });

  it('handles errors gracefully', async () => {
    const req = {
      params: {
        id: 1,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    db.execute.mockRejectedValueOnce(new Error('Database error'));

    await assetController.deleteAsset(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
  
  it('handles non-existent asset ID', async () => {
    const req = {
      params: {
        id: 999, // Non-existent asset ID
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    db.execute.mockResolvedValueOnce([[], {}]); // Mocking a non-existent asset

    await assetController.deleteAsset(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Asset not found' });
  });
  // Add more test cases for non-existent asset, etc.
});