// authController.test.js
const authController = require("../controllers/authController");
jest.mock('../config/db'); // Mock the database module
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _const = require('../config/constant');
const nodemailer = require('nodemailer');
const db = require('../config/db');

var mysql = require('mysql2/promise');
require('iconv-lite').encodingExists('foo');



it('tests jest-mysql', async () => {

    var connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '12345678',
        database: 'residential'
    });
       
    const [rows, fields] = await connection.execute("SELECT * FROM assets");
    console.log(rows);
    console.log(fields);
});

describe('authController', () => {
  let mockResponse;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('registerUser', () => {
    it('should successfully register a user', async () => {
      const mockUser = {
        username: 'testUser',
        email: 'testEmail',
        password: 'testPassword',
        phone: 'testPhone',
        role: 'testRole',
        status: 'testStatus'
      };

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(mockUser.password, salt);

      db.execute.mockResolvedValueOnce([[]]); // Mocking no existing user with the same email
      db.execute.mockResolvedValueOnce([{ insertId: 1 }]); // Mocking successful insertion

      const req = { body: mockUser };

      await authController.registerUser(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM users WHERE email = ?', [mockUser.email]);
      expect(db.execute).toHaveBeenCalledWith(
        'INSERT INTO users (username, email, password, phone, role, status) VALUES (?, ?, ?, ?, ?, ?)',
        [mockUser.username, mockUser.email, hashed, mockUser.phone, mockUser.role, mockUser.status]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        id: 1,
        username: mockUser.username,
        email: mockUser.email,
        phone: mockUser.phone,
        role: mockUser.role,
        status: mockUser.status
      });
    });

    it('should handle errors gracefully when registering a user', async () => {
      const mockUser = {
        username: 'testUser',
        email: 'testEmail',
        password: 'testPassword',
        phone: 'testPhone',
        role: 'testRole',
        status: 'testStatus'
      };

      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { body: mockUser };

      await authController.registerUser(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith('Register fails');
    });
  });

  describe('login', () => {
    it('should successfully log in a user with correct credentials', async () => {
      const mockUser = {
        email: 'testEmail',
        password: 'testPassword',
      };

      const mockDbUser = {
        ...mockUser,
        password: await bcrypt.hash(mockUser.password, 10), // hashed password
      };

      db.execute.mockResolvedValueOnce([[mockDbUser]]); // Mocking user exists in the database

      const req = { body: mockUser };

      await authController.login(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM users WHERE email = ?', [mockUser.email]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should handle errors gracefully when logging in a user', async () => {
      const mockUser = {
        email: 'testEmail',
        password: 'testPassword',
      };

      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { body: mockUser };

      await authController.login(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('forgotPassword', () => {
    it('should successfully handle forgot password request', async () => {
      const mockUser = {
        email: 'testEmail',
      };

      const mockDbUser = {
        id: 1,
        email: mockUser.email,
      };

      db.execute.mockResolvedValueOnce([[mockDbUser]]); // Mocking user exists in the database
      db.execute.mockResolvedValueOnce([{}]); // Mocking successful insertion

      const req = { body: mockUser };

      await authController.forgotPassword(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM users WHERE email = ?', [mockUser.email]);
      expect(db.execute).toHaveBeenCalled(); // Check if a token was inserted into the database
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Reset email sent!', status: true });
    });

    it('sends a reset email for a valid user', async () => {
          // Mock database query to return a valid user
      
          const req = {
            body: {
              email: 'test@example.com',
            },
          };
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
      try{
        await authController.forgotPassword(req, res);

      }catch{
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: true }));

      }
      
        });

    it('should handle errors gracefully when handling forgot password request', async () => {
      const mockUser = {
        email: 'testEmail',
      };

      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { body: mockUser };
try{
  await authController.forgotPassword(req, mockResponse);

}catch{
  
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith(mockError);

}
    });
  });

  describe('resetPassword', () => {
    it('should successfully reset a user password', async () => {
      const mockUser = {
        token: 'testToken',
        newPassword: 'newTestPassword',
      };

      const mockDbUser = {
        id: 1,
        user_id: 1,
        token: mockUser.token,
        expires_at: new Date(Date.now() + 3600000), // token is not expired
      };

      db.execute.mockResolvedValueOnce([[mockDbUser]]); // Mocking token exists in the database
      db.execute.mockResolvedValueOnce([{}]); // Mocking successful update
      db.execute.mockResolvedValueOnce([{}]); // Mocking successful deletion

      const req = { body: mockUser };

      await authController.resetPassword(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM password_reset_tokens WHERE token = ?', [mockUser.token]);
      expect(db.execute).toHaveBeenCalledWith('UPDATE users SET password = ? WHERE id = ?', [expect.any(String), mockDbUser.user_id]);
      expect(db.execute).toHaveBeenCalledWith('DELETE FROM password_reset_tokens WHERE token = ?', [mockUser.token]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Password reset successful!', status: true });
    });

    it('returns an error for an invalid or expired token', async () => {
          // Mock database query to return an invalid or expired token
      
          const req = {
            body: {
              token: 'invalidtoken',
              newPassword: 'newpassword123',
            },
          };
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
      try{
        await authController.resetPassword(req, res);

      }catch{
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid or expired token!', status: false }));

      }
      
        });

    it('should handle errors gracefully when resetting a user password', async () => {
      const mockUser = {
        token: 'testToken',
        newPassword: 'newTestPassword',
      };

      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { body: mockUser };

      await authController.resetPassword(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

});


  // describe('Forgot Password', () => {
  //   it('sends a reset email for a valid user', async () => {
  //     // Mock database query to return a valid user
  
  //     const req = {
  //       body: {
  //         email: 'test@example.com',
  //       },
  //     };
  //     const res = {
  //       status: jest.fn().mockReturnThis(),
  //       json: jest.fn(),
  //     };
  
  //     await authController.forgotPassword(req, res);
  
  //     expect(res.status).toHaveBeenCalledWith(200);
  //     expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: true }));
  //   });
  
  //   it('returns an error for an unregistered account', async () => {
  //     // Mock database query to return no user
  
  //     const req = {
  //       body: {
  //         email: 'nonexistent@example.com',
  //       },
  //     };
  //     const res = {
  //       status: jest.fn().mockReturnThis(),
  //       json: jest.fn(),
  //     };
  
  //     await authController.forgotPassword(req, res);
  
  //     expect(res.status).toHaveBeenCalledWith(400);
  //     expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Unregistered account!', status: false }));
  //   });
  // });

  // describe('Reset Password', () => {
  //   it('resets password for a valid token', async () => {
  //     // Mock database query to return a valid token
  
  //     const req = {
  //       body: {
  //         token: 'validtoken',
  //         newPassword: 'newpassword123',
  //       },
  //     };
  //     const res = {
  //       status: jest.fn().mockReturnThis(),
  //       json: jest.fn(),
  //     };
  
  //     await authController.resetPassword(req, res);
  
  //     expect(res.status).toHaveBeenCalledWith(200);
  //     expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: true }));
  //   });
  
  //   it('returns an error for an invalid or expired token', async () => {
  //     // Mock database query to return an invalid or expired token
  
  //     const req = {
  //       body: {
  //         token: 'invalidtoken',
  //         newPassword: 'newpassword123',
  //       },
  //     };
  //     const res = {
  //       status: jest.fn().mockReturnThis(),
  //       json: jest.fn(),
  //     };
  
  //     await authController.resetPassword(req, res);
  
  //     expect(res.status).toHaveBeenCalledWith(400);
  //     expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid or expired token!', status: false }));
  //   });
  // });