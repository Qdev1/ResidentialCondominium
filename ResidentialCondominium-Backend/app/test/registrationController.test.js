// registrationController.test.js
const registrationController = require('../controllers/registrationController');

const db = require('../config/db');

jest.mock('../config/db');

describe('registrationController', () => {
  let mockResponse;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('registerPersonalInfo', () => {
    it('should successfully register personal and family information', async () => {
      const req = {
        body: {
          userId: 1,
          personalInfo: {
            fullName: 'Test User',
            address: 'Test Address',
            phoneNumber: '1234567890'
          },
          familyInfo: {
            spouseName: 'Test Spouse',
            children: ['Child1', 'Child2']
          }
        }
      };

      const mockUserRows = [{ id: 1 }];
      db.execute.mockResolvedValueOnce([mockUserRows]);

      const mockPersonalInfoRows = { insertId: 1 };
      db.execute.mockResolvedValueOnce([mockPersonalInfoRows]);

      await registrationController.registerPersonalInfo(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM users WHERE id = ?', [req.body.userId]);
      expect(db.execute).toHaveBeenCalledWith(
        'INSERT INTO personal_info (user_id, full_name, address, phone_number) VALUES (?, ?, ?, ?)',
        [req.body.userId, req.body.personalInfo.fullName, req.body.personalInfo.address, req.body.personalInfo.phoneNumber]
      );
      for (const childName of req.body.familyInfo.children) {
        expect(db.execute).toHaveBeenCalledWith(
          'INSERT INTO family_info (personal_info_id, spouse_name, child_name) VALUES (?, ?, ?)',
          [mockPersonalInfoRows.insertId, req.body.familyInfo.spouseName, childName]
        );
      }
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Personal information registered successfully', status: true });
    });

    it('should handle errors when user not found', async () => {
      const req = {
        body: {
          userId: 1,
          personalInfo: {
            fullName: 'Test User',
            address: 'Test Address',
            phoneNumber: '1234567890'
          },
          familyInfo: {
            spouseName: 'Test Spouse',
            children: ['Child1', 'Child2']
          }
        }
      };

      const mockUserRows = [];
      db.execute.mockResolvedValueOnce([mockUserRows]);

      await registrationController.registerPersonalInfo(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM users WHERE id = ?', [req.body.userId]);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found', status: false });
    });

    it('should handle database errors when registering personal information', async () => {
      const req = {
        body: {
          userId: 1,
          personalInfo: {
            fullName: 'Test User',
            address: 'Test Address',
            phoneNumber: '1234567890'
          },
          familyInfo: {
            spouseName: 'Test Spouse',
            children: ['Child1', 'Child2']
          }
        }
      };

      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      await registrationController.registerPersonalInfo(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('updatePersonalInfo', () => {
    it('should successfully update personal and family information', async () => {
      const req = {
        body: {
          userId: 1,
          personalInfo: {
            fullName: 'Test User',
            address: 'Test Address',
            phoneNumber: '1234567890'
          },
          familyInfo: {
            spouseName: 'Test Spouse',
            children: ['Child1', 'Child2']
          }
        }
      };

      const mockUserRows = [{ id: 1 }];
      db.execute.mockResolvedValueOnce([mockUserRows]);

      const mockExistingPersonalInfoRows = [{ id: 1 }];
      db.execute.mockResolvedValueOnce([mockExistingPersonalInfoRows]);

      await registrationController.updatePersonalInfo(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM users WHERE id = ?', [req.body.userId]);
      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM personal_info WHERE user_id = ?', [req.body.userId]);
      expect(db.execute).toHaveBeenCalledWith(
        'UPDATE personal_info SET full_name = ?, address = ?, phone_number = ? WHERE user_id = ?',
        [req.body.personalInfo.fullName, req.body.personalInfo.address, req.body.personalInfo.phoneNumber, req.body.userId]
      );
      expect(db.execute).toHaveBeenCalledWith('DELETE FROM family_info WHERE personal_info_id = ?', [mockExistingPersonalInfoRows[0].id]);
      for (const childName of req.body.familyInfo.children) {
        expect(db.execute).toHaveBeenCalledWith(
          'INSERT INTO family_info (personal_info_id, spouse_name, child_name) VALUES (?, ?, ?)',
          [mockExistingPersonalInfoRows[0].id, req.body.familyInfo.spouseName, childName]
        );
      }
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Personal information updated successfully', status: true });
    });

    it('should handle errors when user not found', async () => {
      const req = {
        body: {
          userId: 1,
          personalInfo: {
            fullName: 'Test User',
            address: 'Test Address',
            phoneNumber: '1234567890'
          },
          familyInfo: {
            spouseName: 'Test Spouse',
            children: ['Child1', 'Child2']
          }
        }
      };

      const mockUserRows = [];
      db.execute.mockResolvedValueOnce([mockUserRows]);

      await registrationController.updatePersonalInfo(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM users WHERE id = ?', [req.body.userId]);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found', status: false });
    });

    it('should handle errors when personal information not found', async () => {
      const req = {
        body: {
          userId: 1,
          personalInfo: {
            fullName: 'Test User',
            address: 'Test Address',
            phoneNumber: '1234567890'
          },
          familyInfo: {
            spouseName: 'Test Spouse',
            children: ['Child1', 'Child2']
          }
        }
      };

      const mockUserRows = [{ id: 1 }];
      db.execute.mockResolvedValueOnce([mockUserRows]);

      const mockExistingPersonalInfoRows = [];
      db.execute.mockResolvedValueOnce([mockExistingPersonalInfoRows]);

      await registrationController.updatePersonalInfo(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM users WHERE id = ?', [req.body.userId]);
      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM personal_info WHERE user_id = ?', [req.body.userId]);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Personal information not found', status: false });
    });

    it('should handle database errors when updating personal information', async () => {
      const req = {
        body: {
          userId: 1,
          personalInfo: {
            fullName: 'Test User',
            address: 'Test Address',
            phoneNumber: '1234567890'
          },
          familyInfo: {
            spouseName: 'Test Spouse',
            children: ['Child1', 'Child2']
          }
        }
      };

      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      await registrationController.updatePersonalInfo(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getAllPersonalInfo', () => {
    it('should successfully get all personal information', async () => {
      const req = {};

      const mockPersonalInfoRows = [
        { id: 1, full_name: 'Test User', address: 'Test Address', phone_number: '1234567890', spouse_name: 'Test Spouse', children: 'Child1, Child2' }
      ];
      db.execute.mockResolvedValueOnce([mockPersonalInfoRows]);

      await registrationController.getAllPersonalInfo(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(`
          SELECT 
          pi.id,
          pi.full_name,
          pi.address,
          pi.phone_number,
          fi.spouse_name, 
          GROUP_CONCAT(fi.child_name SEPARATOR ', ') AS children
          FROM personal_info pi
          LEFT JOIN family_info fi ON pi.id = fi.personal_info_id
          GROUP BY pi.id, pi.full_name, pi.address, pi.phone_number, fi.spouse_name;
      `);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockPersonalInfoRows });
    });

    it('should handle errors when no personal information records found', async () => {
      const req = {};

      const mockPersonalInfoRows = [];
      db.execute.mockResolvedValueOnce([mockPersonalInfoRows]);

      await registrationController.getAllPersonalInfo(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(`
          SELECT 
          pi.id,
          pi.full_name,
          pi.address,
          pi.phone_number,
          fi.spouse_name, 
          GROUP_CONCAT(fi.child_name SEPARATOR ', ') AS children
          FROM personal_info pi
          LEFT JOIN family_info fi ON pi.id = fi.personal_info_id
          GROUP BY pi.id, pi.full_name, pi.address, pi.phone_number, fi.spouse_name;
      `);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'No personal information records found', status: false });
    });

    it('should handle database errors when getting all personal information', async () => {
      const req = {};

      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      await registrationController.getAllPersonalInfo(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });
});