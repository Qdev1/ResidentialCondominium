// registrationController.test.js
const registrationController = require('../controllers/registrationController');

const db = require('../config/db');

jest.mock('../config/db');

describe('registerPersonalInfo', () => {
  it('handles non-existent user', async () => {
    const req = {
      body: {
        userId: 999,
        personalInfo: {
          fullName: 'John Doe',
          address: '123 Main St',
          phoneNumber: '123-456-7890'
        },
        familyInfo: null
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    db.execute.mockResolvedValueOnce([[]]);

    await registrationController.registerPersonalInfo(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found', status: false });
  });

  it('successfully registers personal and family information', async () => {
    const req = {
      body: {
        userId: 1,
        personalInfo: {
          fullName: 'John Doe',
          address: '123 Main St',
          phoneNumber: '123-456-7890'
        },
        familyInfo: {
          spouseName: 'Jane Doe',
          children: ['Child1', 'Child2']
        }
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    db.execute
      .mockResolvedValueOnce([[{ id: 1 }]])
      .mockResolvedValueOnce([{ insertId: 1 }])
      .mockResolvedValue([{}]);

    await registrationController.registerPersonalInfo(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Personal information registered successfully', status: true });
  });

  it('handles database errors during user check', async () => {
    const req = {
        body: {
          userId: 1,
          personalInfo: {
            fullName: 'John Doe',
            address: '123 Main St',
            phoneNumber: '123-456-7890'
          },
          familyInfo: {
            spouseName: 'Jane Doe',
            children: ['Child1', 'Child2']
          }
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

    db.execute.mockRejectedValueOnce(new Error('Database error'));

    await registrationController.registerPersonalInfo(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.any(Object));
  });

  it('handles database errors during personal info insertion', async () => {
    const req = {
        body: {
          userId: 1,
          personalInfo: {
            fullName: 'John Doe',
            address: '123 Main St',
            phoneNumber: '123-456-7890'
          },
          familyInfo: {
            spouseName: 'Jane Doe',
            children: ['Child1', 'Child2']
          }
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  });

  it('registers only personal information if family info is not provided', async () => {
    const req = {
        body: {
          userId: 1,
          personalInfo: {
            fullName: 'John Doe',
            address: '123 Main St',
            phoneNumber: '123-456-7890'
          },
          familyInfo: {
            spouseName: 'Jane Doe',
            children: ['Child1', 'Child2']
          }
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  });

  // Additional test cases...
});
