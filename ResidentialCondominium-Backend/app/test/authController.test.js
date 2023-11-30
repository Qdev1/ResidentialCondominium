// authController.test.js
const authController = require("../controllers/authController");

describe('Register User', () => {
  it('registers a new user', async () => {
    const req = {
      body: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
        role: 'user',
        status: 'active',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await authController.registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ username: 'testuser', status: 'active' }));
  });

  it('returns an error for duplicate email', async () => {
    const req = {
      body: {
        email: 'existing@example.com',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await authController.registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith('Email is exist');
  });
});

describe('Login', () => {
    it('logs in a user with correct credentials', async () => {
      // Mock database query to return a user with correct credentials
  
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        header: jest.fn(),
        json: jest.fn(),
      };
  
      await authController.login(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: true }));
    });
  
    it('returns an error for incorrect password', async () => {
      // Mock database query to return a user with incorrect password
  
      const req = {
        body: {
          email: 'test@example.com',
          password: 'wrongpassword',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await authController.login(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Wrong password!', status: false }));
    });
  
    it('returns an error for unregistered account', async () => {
      // Mock database query to return no user
  
      const req = {
        body: {
          email: 'nonexistent@example.com',
          password: 'password123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await authController.login(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Unregistered account!', status: false }));
    });
  });


  describe('Forgot Password', () => {
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
  
      await authController.forgotPassword(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: true }));
    });
  
    it('returns an error for an unregistered account', async () => {
      // Mock database query to return no user
  
      const req = {
        body: {
          email: 'nonexistent@example.com',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await authController.forgotPassword(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Unregistered account!', status: false }));
    });
  });

  describe('Reset Password', () => {
    it('resets password for a valid token', async () => {
      // Mock database query to return a valid token
  
      const req = {
        body: {
          token: 'validtoken',
          newPassword: 'newpassword123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await authController.resetPassword(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: true }));
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
  
      await authController.resetPassword(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid or expired token!', status: false }));
    });
  });