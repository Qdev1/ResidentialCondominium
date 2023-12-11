const db = require('../config/db');
const contractController = require('../controllers/contractController');

jest.mock('../config/db');

describe('contractController', () => {
  let mockResponse;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('createContract', () => {
    it('should successfully create a contract', async () => {
      const mockContract = {
        vendorId: 1,
        contractorId: 2,
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        description: 'Contract Description',
        value: 1000
      };

      db.execute.mockResolvedValueOnce([{ insertId: 1 }]); // Mocking successful insertion

      const req = { body: mockContract };

      await contractController.createContract(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'INSERT INTO contracts (vendor_id, contractor_id, start_date, end_date, description, value) VALUES (?, ?, ?, ?, ?, ?)',
        [mockContract.vendorId, mockContract.contractorId, mockContract.startDate, mockContract.endDate, mockContract.description, mockContract.value]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ id: 1, ...mockContract });
    });

    it('should handle database errors when creating a contract', async () => {
      const mockContract = {
        vendorId: 1,
        contractorId: 2,
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        description: 'Contract Description',
        value: 1000
      };

      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { body: mockContract };

      await contractController.createContract(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('updateContract', () => {
    it('should successfully update a contract', async () => {
      const mockContract = {
        vendorId: 1,
        contractorId: 2,
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        description: 'Updated Contract Description',
        value: 2000
      };

      db.execute.mockResolvedValueOnce([{}]); // Mocking successful update

      const req = { params: { id: 1 }, body: mockContract };

      await contractController.updateContract(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'UPDATE contracts SET vendor_id = ?, contractor_id = ?, start_date = ?, end_date = ?, description = ?, value = ? WHERE id = ?',
        [mockContract.vendorId, mockContract.contractorId, mockContract.startDate, mockContract.endDate, mockContract.description, mockContract.value, req.params.id]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Contract updated successfully' });
    });

    it('should handle database errors when updating a contract', async () => {
      const mockContract = {
        vendorId: 1,
        contractorId: 2,
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        description: 'Updated Contract Description',
        value: 2000
      };

      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { id: 1 }, body: mockContract };

      await contractController.updateContract(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('deleteContract', () => {
    it('should successfully delete a contract', async () => {
      db.execute.mockResolvedValueOnce([{}]); // Mocking successful deletion

      const req = { params: { id: 1 } };

      await contractController.deleteContract(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('DELETE FROM contracts WHERE id = ?', [req.params.id]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Contract deleted successfully' });
    });

    it('should handle database errors when deleting a contract', async () => {
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { id: 1 } };

      await contractController.deleteContract(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getAllContracts', () => {
    it('should successfully get all contracts', async () => {
      const mockContracts = [{ id: 1, vendor_id: 1, contractor_id: 2, start_date: '2023-01-01', end_date: '2023-12-31', description: 'Contract Description', value: 1000 }];
      db.execute.mockResolvedValueOnce([mockContracts]); // Mocking contracts exist in the database

      const req = {};

      await contractController.getAllContracts(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM contracts');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockContracts });
    });

    it('should handle database errors when getting all contracts', async () => {
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = {};

      await contractController.getAllContracts(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getContractById', () => {
    it('should successfully get a contract by id', async () => {
      const mockContract = [{ id: 1, vendor_id: 1, contractor_id: 2, start_date: '2023-01-01', end_date: '2023-12-31', description: 'Contract Description', value: 1000 }];
      db.execute.mockResolvedValueOnce([mockContract]); // Mocking contract exists in the database

      const req = { params: { id: 1 } };

      await contractController.getContractById(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM contracts WHERE id = ?', [req.params.id]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockContract[0] });
    });

    it('should handle contract not found scenario', async () => {
      db.execute.mockResolvedValueOnce([[]]); // Simulate no contract found in MySQL database

      const req = { params: { id: 1 } };

      await contractController.getContractById(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM contracts WHERE id = ?', [req.params.id]);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Contract not found' });
    });

    it('should handle database errors when getting a contract by id', async () => {
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { id: 1 } };

      await contractController.getContractById(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('searchContracts', () => {
    it('should successfully search contracts', async () => {
      const mockContracts = [{ id: 1, vendor_id: 1, contractor_id: 2, start_date: '2023-01-01', end_date: '2023-12-31', description: 'Contract Description', value: 1000 }];
      db.execute.mockResolvedValueOnce([mockContracts]); // Mocking contracts exist in the database

      const req = { query: { vendorId: 1, contractorId: 2, startDate: '2023-01-01', endDate: '2023-12-31' } };

      await contractController.searchContracts(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'SELECT * FROM contracts WHERE vendor_id = ? AND contractor_id = ? AND start_date >= ? AND end_date <= ?',
        [req.query.vendorId, req.query.contractorId, req.query.startDate, req.query.endDate]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockContracts });
    });

    it('should handle database errors when searching contracts', async () => {
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { query: { vendorId: 1, contractorId: 2, startDate: '2023-01-01', endDate: '2023-12-31' } };

      await contractController.searchContracts(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });
});

// describe('createContract', () => {
//   let mockResponse;

//   beforeEach(() => {
//     mockResponse = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn().mockReturnThis(),
//     };
//   });

//     it('should create a contract', async () => {
//       const vendorId = 1;
//       const contractorId = 2;
//       const startDate = '2023-12-01';
//       const endDate = '2023-12-31';
//       const description = 'Contract for maintenance services';
//       const value = 10000;
//       const mockResult = { insertId: 1 };
//       db.execute.mockResolvedValueOnce([mockResult]);
  
//       const req = { body: { vendorId, contractorId, startDate, endDate, description, value } };
//       const res = {
//         status: jest.fn(),
//         json: jest.fn(),
//       };
  
//       await contractController.createContract(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(201);
//       expect(res.json).toHaveBeenCalledWith({
//         id: mockResult.insertId,
//         vendorId,
//         contractorId,
//         startDate,
//         endDate,
//         description,
//         value,
//       });
//     });
  
//     it('should handle errors gracefully when creating a contract', async () => {
//       const mockError = new Error('Database error');
//       db.execute.mockRejectedValueOnce(mockError);
  
//       const req = { body: { description: 'Missing required fields' } };
//       const res = {
//         status: jest.fn(),
//         json: jest.fn(),
//       };
  
//       await contractController.createContract(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith(mockError);
//     });
//   });

//   describe('updateContract', () => {
//     it('should update a contract', async () => {
//       const contractId = 1;
//       const vendorId = 1;
//       const contractorId = 2;
//       const startDate = '2023-12-01';
//       const endDate = '2023-12-31';
//       const description = 'Updated contract description';
//       const value = 10000;
  
//       const req = {
//         params: { id: contractId },
//         body: { vendorId, contractorId, startDate, endDate, description, value },
//       };
//       const res = {
//         status: jest.fn(),
//         json: jest.fn(),
//       };
  
//       await contractController.updateContract(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({ message: 'Contract updated successfully' });
//     });
  
//     it('should handle errors gracefully when updating a contract', async () => {
//       const contractId = 1;
//       const mockError = new Error('Database error');
//       db.execute.mockRejectedValueOnce(mockError);
  
//       const req = { params: { id: contractId }, body: { description: 'Invalid record ID' } };
//       const res = {
//         status: jest.fn(),
//         json: jest.fn(),
//       };
  
//       await contractController.updateContract(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith(mockError);
//     });
//   });

//  describe('deleteContract', () => {
//     it('should successfully delete a contract', async () => {
//       db.execute.mockResolvedValueOnce([{}]); // Mocking successful deletion

//       const req = { params: { id: 1 } };

//       await contractController.deleteContract(req, mockResponse);

//       expect(db.execute).toHaveBeenCalledWith('DELETE FROM contracts WHERE id = ?', [req.params.id]);
//       expect(mockResponse.status).toHaveBeenCalledWith(200);
//       expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Contract deleted successfully' });
//     });

//     it('should handle database errors when deleting a contract', async () => {
//       const mockError = new Error('Database error');
//       db.execute.mockRejectedValueOnce(mockError);

//       const req = { params: { id: 1 } };

//       await contractController.deleteContract(req, mockResponse);

//       expect(mockResponse.status).toHaveBeenCalledWith(500);
//       expect(mockResponse.json).toHaveBeenCalledWith(mockError);
//     });
//   });

//   describe('getAllContracts', () => {
//     it('should get all contracts successfully', async () => {
//       const mockContracts = [{ id: 1, vendorId: 1, contractorId: 2, description: 'Test contract' }];
//       db.execute.mockResolvedValueOnce([mockContracts]);
  
//       const req = {};
//       const res = {
//         status: jest.fn(),
//         json: jest.fn(),
//       };
  
//       await contractController.getAllContracts(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({ data: mockContracts });
//     });
  
//     it('should handle errors gracefully when getting all contracts', async () => {
//       const mockError = new Error('Database error');
//       db.execute.mockRejectedValueOnce(mockError);
  
//       const req = {};
//       const res = {
//         status: jest.fn(),
//         json: jest.fn(),
//       };
  
//       await contractController.getAllContracts(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith(mockError);
//     });
//   });

//   describe('getContractById', () => {
//     it('should get a contract by ID successfully', async () => {
//       const contractId = 1;
//       const mockContract = { id: contractId, vendorId: 1, contractorId: 2, description: 'Test contract' };
//       db.execute.mockResolvedValueOnce([mockContract]);
  
//       const req = { params: { id: contractId } };
//       const res = {
//         status: jest.fn(),
//         json: jest.fn(),
//       };
  
//       await contractController.getContractById(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({ data: mockContract });
//     });
  
//     it('should return a 404 if the contract is not found', async () => {
//       const contractId = 1;
//       db.execute.mockResolvedValueOnce([]);
  
//       const req = { params: { id: contractId } };
//       const res = {
//         status: jest.fn(),
//         json: jest.fn(),
//       };
  
//       await contractController.getContractById(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(404);
//       expect(res.json).toHaveBeenCalledWith({ message: 'Contract not found' });
//     });
  
//     it('should handle errors gracefully when getting a contract by ID', async () => {
//       const contractId = 1;
//       const mockError = new Error('Database error');
//       db.execute.mockRejectedValueOnce(mockError);
  
//       const req = { params: { id: contractId } };
//       const res = {
//         status: jest.fn(),
//         json: jest.fn(),
//       };
  
//       await contractController.getContractById(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith(mockError);
//     });
//   });

//   describe('searchContracts', () => {
//     it('should search for contracts by vendor ID', async () => {
//       const vendorId = 1;
//       const mockContracts = [{ id: 1, vendorId, contractorId: 2, description: 'Test contract' }];
//       const query = `SELECT * FROM contracts WHERE vendor_id = ?`;
//       db.execute.mockResolvedValueOnce([mockContracts]);
  
//       const req = { query: { vendorId } };
//       const res = {
//         status: jest.fn(),
//         json: jest.fn(),
//       };
  
//       await contractController.searchContracts(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({ data: mockContracts });
//     });
  
//     it('should search for contracts by contractor ID', async () => {
//       const contractorId = 2;
//       const mockContracts = [{ id: 1, vendorId: 1, contractorId, description: 'Test contract' }];
//       const query = `SELECT * FROM contracts WHERE contractor_id = ?`;
//       db.execute.mockResolvedValueOnce([mockContracts]);
  
//       const req = { query: { contractorId } };
//       const res = {
//         status: jest.fn(),
//         json: jest.fn(),
//       };
  
//       await contractController.searchContracts(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({ data: mockContracts });
//     });
  
//     it('should search for contracts by start date and end date', async () => {
//       const startDate = '2023-12-01';
//       const endDate = '2023-12-31';
//       const mockContracts = [{ id: 1, vendorId: 1, contractorId: 2, description: 'Test contract' }];
//       const query = `SELECT * FROM contracts WHERE start_date >= ? AND end_date <= ?`;
//       db.execute.mockResolvedValueOnce([mockContracts]);
  
//       const req = { query: { startDate, endDate } };
//       const res = {
//         status: jest.fn(),
//         json: jest.fn(),
//       };
  
//       await contractController.searchContracts(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({ data: mockContracts });
//     });
  
//     it('should search for contracts by various criteria combined', async () => {
//       const vendorId = 1;
//       const contractorId = 2;
//       const startDate = '2023-12-01';
//       const endDate = '2023-12-31';
//       const mockContracts = [{ id: 1, vendorId, contractorId, description: 'Test contract' }];
//       const query = `SELECT * FROM contracts WHERE vendor_id = ? AND contractor_id = ? AND start_date >= ? AND end_date <= ?`;
//       db.execute.mockResolvedValueOnce([mockContracts]);
  
//       const req = { query: { vendorId, contractorId, startDate, endDate } };
//       const res = {
//         status: jest.fn(),
//         json: jest.fn(),
//       };
  
//       await contractController.searchContracts(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({ data: mockContracts });
//     });
  
//     it('should handle errors gracefully when searching for contracts', async () => {
//       const mockError = new Error('Database error');
//       db.execute.mockRejectedValueOnce(mockError);
  
//       const req = { query: {} };
//       const res = {
//         status: jest.fn(),
//         json: jest.fn(),
//       };
  
//       await contractController.searchContracts(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith(mockError);
//     });
//   });