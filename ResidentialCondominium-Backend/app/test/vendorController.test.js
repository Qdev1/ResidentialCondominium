const db = require('../config/db');
const vendorController = require('../controllers/vendorController');

jest.mock('../config/db');

describe('vendorController', () => {
  let mockResponse;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('createVendor', () => {
    it('should successfully create a vendor', async () => {
      const vendorData = { name: 'Vendor A', email: 'vendorA@example.com', phone: '1234567890', address: 'Address A' };
      db.execute.mockResolvedValueOnce([{ insertId: 1 }]); // Mocking successful insertion

      const req = { body: vendorData };

      await vendorController.createVendor(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'INSERT INTO vendors (name, email, phone, address) VALUES (?, ?, ?, ?)',
        [vendorData.name, vendorData.email, vendorData.phone, vendorData.address]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ id: 1, ...vendorData });
    });

    it('should handle database errors when creating a vendor', async () => {
      const vendorData = { name: 'Vendor A', email: 'vendorA@example.com', phone: '1234567890', address: 'Address A' };
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { body: vendorData };

      await vendorController.createVendor(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('updateVendor', () => {
    it('should successfully update a vendor', async () => {
      const vendorId = 1;
      const vendorData = { name: 'Vendor B', email: 'vendorB@example.com', phone: '0987654321', address: 'Address B' };
      db.execute.mockResolvedValueOnce([{}]); // Mocking successful update

      const req = { params: { id: vendorId }, body: vendorData };

      await vendorController.updateVendor(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'UPDATE vendors SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?',
        [vendorData.name, vendorData.email, vendorData.phone, vendorData.address, vendorId]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Vendor updated successfully' });
    });

    it('should handle database errors when updating a vendor', async () => {
      const vendorId = 1;
      const vendorData = { name: 'Vendor B', email: 'vendorB@example.com', phone: '0987654321', address: 'Address B' };
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { id: vendorId }, body: vendorData };

      await vendorController.updateVendor(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('deleteVendor', () => {
    it('should successfully delete a vendor', async () => {
      const vendorId = 1;
      db.execute.mockResolvedValueOnce([{}]); // Mocking successful deletion

      const req = { params: { id: vendorId } };

      await vendorController.deleteVendor(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('DELETE FROM vendors WHERE id = ?', [vendorId]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Vendor deleted successfully' });
    });

    it('should handle database errors when deleting a vendor', async () => {
      const vendorId = 1;
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { id: vendorId } };

      await vendorController.deleteVendor(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getAllVendors', () => {
    it('should successfully get all vendors', async () => {
      const mockVendors = [
        { id: 1, name: 'Vendor A', email: 'vendorA@example.com', phone: '1234567890', address: 'Address A' },
        { id: 2, name: 'Vendor B', email: 'vendorB@example.com', phone: '0987654321', address: 'Address B' }
      ];
      db.execute.mockResolvedValueOnce([mockVendors]); // Mocking vendors exist

      const req = {};

      await vendorController.getAllVendors(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM vendors');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockVendors });
    });

    it('should handle database errors when getting all vendors', async () => {
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = {};

      await vendorController.getAllVendors(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });
  describe('getVendorById', () => {
    it('should successfully get a vendor by id', async () => {
      const vendorId = 1;
      const mockVendor = [{ id: 1, name: 'Vendor A', email: 'vendorA@example.com', phone: '1234567890', address: 'Address A' }];
      db.execute.mockResolvedValueOnce([mockVendor]); // Mocking vendor exists

      const req = { params: { id: vendorId } };

      await vendorController.getVendorById(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM vendors WHERE id = ?', [vendorId]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockVendor[0] });
    });

    it('should handle database errors when getting a vendor by id', async () => {
      const vendorId = 1;
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { id: vendorId } };

      await vendorController.getVendorById(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });
});