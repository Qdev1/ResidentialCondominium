const db = require('../config/db');
const customerEnrollmentController = require('../controllers/customerEnrollmentController');

jest.mock('../config/db');

describe('customerEnrollmentController', () => {
  let mockResponse;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('getAllCustomers', () => {
    it('should successfully get all customers', async () => {
      const mockCustomers = [{ id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Street', note: 'Test note' }];
      db.execute.mockResolvedValueOnce([mockCustomers]); // Mocking customers exist in the database

      const req = {};

      await customerEnrollmentController.getAllCustomers(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM customers');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockCustomers });
    });

    it('should handle database errors when getting all customers', async () => {
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = {};

      await customerEnrollmentController.getAllCustomers(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getCustomerById', () => {
    it('should successfully get a customer by id', async () => {
      const mockCustomer = [{ id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Street', note: 'Test note' }];
      db.execute.mockResolvedValueOnce([mockCustomer]); // Mocking customer exists in the database

      const req = { params: { id: 1 } };

      await customerEnrollmentController.getCustomerById(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM customers WHERE id = ?', [req.params.id]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockCustomer[0] });
    });

    it('should handle customer not found scenario', async () => {
      db.execute.mockResolvedValueOnce([[]]); // Simulate no customer found in MySQL database

      const req = { params: { id: 1 } };

      await customerEnrollmentController.getCustomerById(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM customers WHERE id = ?', [req.params.id]);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Customer not found' });
    });

    it('should handle database errors when getting a customer by id', async () => {
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { id: 1 } };

      await customerEnrollmentController.getCustomerById(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('createCustomer', () => {
    it('should successfully create a customer', async () => {
      const mockCustomer = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Street',
        note: 'Test note'
      };

      db.execute.mockResolvedValueOnce([{ insertId: 1 }]); // Mocking successful insertion

      const req = { body: mockCustomer };

      await customerEnrollmentController.createCustomer(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'INSERT INTO customers (name, email, phone, address, note) VALUES (?, ?, ?, ?, ?)',
        [mockCustomer.name, mockCustomer.email, mockCustomer.phone, mockCustomer.address, mockCustomer.note]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ id: 1, ...mockCustomer });
    });

    it('should handle database errors when creating a customer', async () => {
      const mockCustomer = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Street',
        note: 'Test note'
      };

      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { body: mockCustomer };

      await customerEnrollmentController.createCustomer(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('updateCustomer', () => {
    it('should successfully update a customer', async () => {
      const mockCustomer = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Street',
        note: 'Updated note'
      };

      db.execute.mockResolvedValueOnce([{}]); // Mocking successful update

      const req = { params: { id: 1 }, body: mockCustomer };

      await customerEnrollmentController.updateCustomer(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'UPDATE customers SET name = ?, email = ?, phone = ?, address = ?, note = ? WHERE id = ?',
        [mockCustomer.name, mockCustomer.email, mockCustomer.phone, mockCustomer.address, mockCustomer.note, req.params.id]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Customer updated successfully' });
    });

    it('should handle database errors when updating a customer', async () => {
      const mockCustomer = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Street',
        note: 'Updated note'
      };

      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { id: 1 }, body: mockCustomer };

      await customerEnrollmentController.updateCustomer(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });
  describe('deleteCustomer', () => {
    it('should successfully delete a customer', async () => {
      db.execute.mockResolvedValueOnce([{}]); // Mocking successful deletion

      const req = { params: { id: 1 } };

      await customerEnrollmentController.deleteCustomer(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('DELETE FROM customers WHERE id = ?', [req.params.id]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Customer deleted successfully' });
    });

    it('should handle database errors when deleting a customer', async () => {
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { id: 1 } };

      await customerEnrollmentController.deleteCustomer(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('searchCustomers', () => {
    it('should successfully search customers', async () => {
      const mockCustomers = [{ id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Street', note: 'Test note' }];
      db.execute.mockResolvedValueOnce([mockCustomers]); // Mocking customers exist in the database

      const req = { query: { keyword: 'John' } };

      await customerEnrollmentController.searchCustomers(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'SELECT * FROM customers WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? OR address LIKE ?',
        [`%${req.query.keyword}%`, `%${req.query.keyword}%`, `%${req.query.keyword}%`, `%${req.query.keyword}%`]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockCustomers });
    });

    it('should handle database errors when searching customers', async () => {
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { query: { keyword: 'John' } };

      await customerEnrollmentController.searchCustomers(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });
});

// describe('getAllCustomers', () => {
//   it('should get all customers successfully', async () => {
//     const mockCustomers = [{ id: 1, name: 'John Doe', email: 'john.doe@example.com' }];
//     db.execute.mockResolvedValueOnce([mockCustomers]);

//     const req = {};
//     const res = {
//       status: jest.fn(),
//       json: jest.fn(),
//     };

//     await customerEnrollmentController.getAllCustomers(req, res);

//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({ data: mockCustomers });
//   });

//   it('should handle errors gracefully when getting all customers', async () => {
//     const mockError = new Error('Database error');
//     db.execute.mockRejectedValueOnce(mockError);

//     const req = {};
//     const res = {
//       status: jest.fn(),
//       json: jest.fn(),
//     };

//     await customerEnrollmentController.getAllCustomers(req, res);

//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.json).toHaveBeenCalledWith(mockError);
//   });
// });

// describe('getCustomerById', () => {
//     it('should get a customer by ID successfully', async () => {
//       const customerId = 1;
//       const mockCustomer = { id: customerId, name: 'John Doe', email: 'john.doe@example.com' };
//       db.execute.mockResolvedValueOnce([mockCustomer]);
  
//       const req = { params: { id: customerId } };
//       const res = {
//         status: jest.fn(),
//         json: jest.fn(),
//       };
  
//       await customerEnrollmentController.getCustomerById(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({ data: mockCustomer });
//     });
  
//     it('should return a 404 if the customer is not found', async () => {
//       const customerId = 1;
//       db.execute.mockResolvedValueOnce([]);
  
//       const req = { params: { id: customerId } };
//       const res = {
//         status: jest.fn(),
//         json: jest.fn(),
//       };
  
//       await customerEnrollmentController.getCustomerById(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(404);
//       expect(res.json).toHaveBeenCalledWith({ message: 'Customer not found' });
//     });
  
//     it('should handle errors gracefully when getting a customer by ID', async () => {
//       const customerId = 1;
//       const mockError = new Error('Database error');
//       db.execute.mockRejectedValueOnce(mockError);
  
//       const req = { params: { id: customerId } };
//       const res = {
//         status: jest.fn(),
//         json: jest.fn(),
//       };
  
//       await customerEnrollmentController.getCustomerById(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith(mockError);
//     });
//   });

//   describe('createCustomer', () => {
//     it('should create a customer successfully', async () => {
//       const mockResult = { insertId: 1 };
//       const customerData = {
//         name: 'John Doe',
//         email: 'john.doe@example.com',
//         phone: '123-456-7890',
//         address: '123 Main Street',
//         note: 'Test customer',
//       };
//       db.execute.mockResolvedValueOnce([mockResult]);
  
//       const req = { body: customerData };
//       const res = {
//         status: jest.fn(),
//         json: jest.fn(),
//       };
  
//       await customerEnrollmentController.createCustomer(req, res);

//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith(mockError);
//     });
//   });

//   describe('updateCustomer', () => {
//     it('should update a customer successfully', async () => {
//       const customerId = 1;
//       const customerData = {
//         name: 'John Doe',
//         email: 'john.doe@example.com',
//         phone: '123-456-7890',
//         address: '123 Main Street',
//         note: 'Updated customer note',
//       };
  
//       const req = {
//         params: { id: customerId },
//         body: customerData,
//       };
//       const res = {
//         status: jest.fn(),
//         json: jest.fn(),
//       };
  
//       await customerEnrollmentController.updateCustomer(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({ message: 'Customer updated successfully' });
//     });
  
//     it('should handle errors gracefully when updating a customer', async () => {
//       const customerId = 1;
//       const mockError = new Error('Database error');
//       db.execute.mockRejectedValueOnce(mockError);
  
//       const req = {
//         params: { id: customerId },
//         body: { name: 'Invalid customer data' },
//       };
//       const res = {
//         status: jest.fn(),
//         json: jest.fn(),
//       };
  
//       await customerEnrollmentController.updateCustomer(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith(mockError);
//     });
//   });

//   describe('deleteCustomer', () => {
//     it('should delete a customer successfully', async () => {
//       const customerId = 1;
  
//       const req = { params: { id: customerId } };
//       const res = {
//         status: jest.fn(),
//         json: jest.fn(),
//       };
  
//       await customerEnrollmentController.deleteCustomer(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({ message: 'Customer deleted successfully' });
//     });
  
//     it('should handle errors gracefully when deleting a customer', async () => {
//       const customerId = 1;
//       const mockError = new Error('Database error');
//       db.execute.mockRejectedValueOnce(mockError);
  
//       const req = { params: { id: customerId } };
//       const res = {
//         status: jest.fn(),
//         json: jest.fn(),
//       };
  
//       await customerEnrollmentController.deleteCustomer(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith(mockError);
//     });
//   });

//   describe('searchCustomers', () => {
//     it('should search for customers by keyword', async () => {
//       const keyword = 'John';
//       const mockCustomers = [{ id: 1, name: 'John Doe', email: 'john.doe@example.com' }];
//       db.execute.mockResolvedValueOnce([mockCustomers]);
  
//       const req = { query: { keyword } };
//       const res = {
//         status: jest.fn(),
//         json: jest.fn(),
//       };
  
//       await customerEnrollmentController.searchCustomers(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({ data: mockCustomers });
//     });
  
//     it('should handle errors gracefully when searching for customers', async () => {
//       const mockError = new Error('Database error');
//       db.execute.mockRejectedValueOnce(mockError);
  
//       const req = { query: {} };
//       const res = {
//         status: jest.fn(),
//         json: jest.fn(),
//       };
  
//       await customerEnrollmentController.searchCustomers(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith(mockError);
//     });
//   });