const db = require('../config/db');
const reportController = require('../controllers/reportController');

jest.mock('../config/db');

describe('reportController', () => {
  let mockResponse;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('createAssetReport', () => {
    it('should successfully create an asset report', async () => {
      const reportData = { assetId: 1, reportDate: '2023-01-01', reportDescription: 'Report A' };
      db.execute.mockResolvedValueOnce([{ insertId: 1 }]); // Mocking successful insertion

      const req = { body: reportData };

      await reportController.createAssetReport(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'INSERT INTO asset_reports (asset_id, report_date, report_description) VALUES (?, ?, ?)',
        [reportData.assetId, reportData.reportDate, reportData.reportDescription]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ id: 1, ...reportData });
    });

    it('should handle database errors when creating an asset report', async () => {
      const reportData = { assetId: 1, reportDate: '2023-01-01', reportDescription: 'Report A' };
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { body: reportData };

      await reportController.createAssetReport(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getAssetReports', () => {
    it('should successfully get all asset reports', async () => {
      const assetId = 1;
      const mockReports = [
        { id: 1, asset_id: 1, report_date: '2023-01-01', report_description: 'Report A' },
        { id: 2, asset_id: 1, report_date: '2023-02-01', report_description: 'Report B' }
      ];
      db.execute.mockResolvedValueOnce([mockReports]); // Mocking reports exist

      const req = { params: { assetId } };

      await reportController.getAssetReports(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM asset_reports WHERE asset_id = ?', [assetId]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockReports });
    });

    it('should handle database errors when getting all asset reports', async () => {
      const assetId = 1;
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { assetId } };

      await reportController.getAssetReports(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });
 
  describe('generateAssetStatistics', () => {
    it('should successfully generate asset statistics', async () => {
      const year = 2023;
      const month = 1;
      const mockStatistics = { year: 2023, month: 1, total_value: 1000, total_assets: 10 };
      db.execute.mockResolvedValueOnce([mockStatistics]); // Mocking statistics exist

      const req = { query: { year, month } };

      await reportController.generateAssetStatistics(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'SELECT ?, ? AS month, SUM(value) AS total_value, COUNT(id) AS total_assets FROM assets WHERE YEAR(created_at) = ? AND MONTH(created_at) = ?',
        [year, month, year, month]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockStatistics });
    });

    it('should handle database errors when generating asset statistics', async () => {
      const year = 2023;
      const month = 1;
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { query: { year, month } };

      await reportController.generateAssetStatistics(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });
});
