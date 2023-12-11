const assetEventController = require('../controllers/assetEventController');
const db = require('../config/db');
jest.mock('../config/db');

describe('purchaseAsset', () => {
  it('should successfully record an asset purchase', async () => {
    const mockAsset = { asset_id: 1, event_date: '2022-01-01', description: 'Purchased Asset', quantity: 1 };

    db.execute.mockResolvedValueOnce([]);

    const req = { body: mockAsset };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    try {
        await assetEventController.purchaseAsset(req, res);
    } catch (err) {
        res.status(500).json({ message: "An error occurred while recording the asset purchase." });
    }

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Asset purchase recorded successfully' });
  });

  it('should handle errors when recording an asset purchase', async () => {
    const mockAsset = { asset_id: 1, event_date: '2022-01-01', description: 'Purchased Asset', quantity: 1 };
    const mockError = new Error('Database error');
    db.execute.mockRejectedValueOnce(mockError);

    const req = { body: mockAsset };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    try {
        await assetEventController.purchaseAsset(req, res);
    } catch (err) {
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "An error occurred while recording the asset purchase." });
    }
  });
});

describe('sellAsset', () => {
  it('should successfully record an asset sale', async () => {
    const mockAsset = { asset_id: 1, event_date: '2022-01-01', description: 'Sold Asset', quantity: 1 };

    db.execute.mockResolvedValueOnce([{ quantity: 2 }]); // Mock current quantity
    db.execute.mockResolvedValueOnce([]); // Mock update query

    const req = { body: mockAsset };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    try {
        await assetEventController.sellAsset(req, res);
    } catch (err) {
        res.status(500).json({ message: "An error occurred while recording the asset sale." });
    }

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Asset sale recorded successfully' });
  });

  it('should handle errors when recording an asset sale', async () => {
    const mockAsset = { asset_id: 1, event_date: '2022-01-01', description: 'Sold Asset', quantity: 1 };
    const mockError = new Error('Database error');
    db.execute.mockRejectedValueOnce(mockError);

    const req = { body: mockAsset };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    try {
        await assetEventController.sellAsset(req, res);
    } catch (err) {
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "An error occurred while recording the asset sale." });
    }
  });
});


describe('moveAsset', () => {
  it('should successfully record asset movement and update description', async () => {
    const mockBody = {
      asset_id: 1,
      event_date: '2023-10-26',
      description: 'Moved laptop to conference room',
    };

    db.execute.mockResolvedValueOnce([]);

    const req = { body: mockBody };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    await assetEventController.moveAsset(req, res);

    expect(db.execute).toHaveBeenCalledWith('INSERT INTO asset_event_history (asset_id, event_type, event_date, description) VALUES (?, ?, ?, ?)', [
      mockBody.asset_id, 'move', mockBody.event_date, mockBody.description
    ]);
    expect(db.execute).toHaveBeenCalledWith('UPDATE assets SET description = ? WHERE id = ?', [mockBody.description, mockBody.asset_id]);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Asset movement recorded successfully' });
  });

  it('should handle errors gracefully when recording asset movement', async () => {
    const mockBody = {};
    const mockError = new Error('Database error');

    db.execute.mockRejectedValueOnce(mockError);

    const req = { body: mockBody };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    await assetEventController.moveAsset(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(mockError);
  });
});

describe('getAllAssetEvents', () => {
  it('should successfully retrieve all asset events', async () => {
    const mockAssetEvents = [{ id: 1, asset_id: 1, event_type: 'purchase', event_date: '2023-10-25' }];

    db.execute.mockResolvedValueOnce([mockAssetEvents]);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    await assetEventController.getAllAssetEvents(req, res);

    expect(db.execute).toHaveBeenCalledWith('SELECT * FROM asset_event_history');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: mockAssetEvents });
  });

  it('should handle errors gracefully when retrieving all asset events', async () => {
    const mockError = new Error('Database error');

    db.execute.mockRejectedValueOnce(mockError);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    await assetEventController.getAllAssetEvents(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(mockError);
  });
});

let mockResponse;

beforeEach(() => {
  mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
});

describe('getAssetEventById', () => {
  it('should successfully retrieve an asset event by id', async () => {
    const mockAssetEvent = [{ id: 1, asset_id: 1, event_type: 'purchase', event_date: '2023-10-25' }];
    db.execute.mockResolvedValueOnce([mockAssetEvent]);

    const req = { params: { id: 1 } };

    await assetEventController.getAssetEventById(req, mockResponse);

    expect(db.execute).toHaveBeenCalledWith('SELECT * FROM asset_event_history WHERE id = ?', [req.params.id]);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ data: mockAssetEvent[0] });
  });

  it('should handle errors gracefully when retrieving an asset event by id', async () => {
    const mockError = new Error('Database error');
    db.execute.mockRejectedValueOnce(mockError);

    const req = { params: { id: 1 } };

    await assetEventController.getAssetEventById(req, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(mockError);
  });
});



describe('deleteAssetEvent', () => {
  it('should successfully delete an asset event', async () => {
    db.execute.mockResolvedValueOnce([]);

    const req = { params: { id: 1 } };

    await assetEventController.deleteAssetEvent(req, mockResponse);

    expect(db.execute).toHaveBeenCalledWith('DELETE FROM asset_event_history WHERE id = ?', [req.params.id]);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Asset event deleted successfully' });
  });

  it('should handle errors gracefully when deleting an asset event', async () => {
    const mockError = new Error('Database error');
    db.execute.mockRejectedValueOnce(mockError);

    const req = { params: { id: 1 } };

    await assetEventController.deleteAssetEvent(req, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(mockError);
  });
});

describe('searchAssetEvents', () => {
  it('should successfully search asset events', async () => {
    const mockAssetEvents = [{ id: 1, asset_id: 1, event_type: 'purchase', event_date: '2023-10-25', description: 'test' }];
    db.execute.mockResolvedValueOnce([mockAssetEvents]);

    const req = { query: { keyword: 'test' } };

    await assetEventController.searchAssetEvents(req, mockResponse);

    expect(db.execute).toHaveBeenCalledWith('SELECT * FROM asset_event_history WHERE description LIKE ?', [`%${req.query.keyword}%`]);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ data: mockAssetEvents });
  });

  it('should handle errors gracefully when searching asset events', async () => {
    const mockError = new Error('Database error');
    db.execute.mockRejectedValueOnce(mockError);

    const req = { query: { keyword: 'test' } };

    await assetEventController.searchAssetEvents(req, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(mockError);
  });
});