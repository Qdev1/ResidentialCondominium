// userController.test.js
const userController = require("../controllers/userController");
const db = require('../config/db');

jest.mock('../config/db');

describe('userController', () => {
  let mockResponse;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('getAllUsers', () => {
    it('should successfully get all users', async () => {
      const mockUsers = [
        { id: 1, email: 'user1@example.com', phone: '1234567890', username: 'user1', role: 'admin', status: 'active' },
        { id: 2, email: 'user2@example.com', phone: '0987654321', username: 'user2', role: 'user', status: 'inactive' }
      ];
      db.execute.mockResolvedValueOnce([mockUsers]); // Mocking users exist

      const req = { query: { page: 1, limit: 10 } };

      await userController.getAllUsers(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM users LIMIT 0, 10');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockUsers });
    });

    it('should handle database errors when getting all users', async () => {
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { query: { page: 1, limit: 10 } };

      await userController.getAllUsers(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('createUser', () => {
    it('should successfully create a user', async () => {
      const userData = { email: 'user@example.com', phone: '1234567890', username: 'user', password: 'password', role: 'admin', status: 'active' };
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      db.execute.mockResolvedValueOnce([[]]); // Mocking user does not exist
      db.execute.mockResolvedValueOnce([{ insertId: 1 }]); // Mocking successful insertion

      const req = { body: userData };

      await userController.createUser(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM users WHERE email = ?', [userData.email]);
      expect(db.execute).toHaveBeenCalledWith(
        'INSERT INTO users (email, phone, username, password, role, status) VALUES (?, ?, ?, ?, ?, ?)',
        [userData.email, userData.phone, userData.username, hashedPassword, userData.role, userData.status]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ id: 1, ...userData, password: hashedPassword });
    });


    
    it('should handle database errors when creating a user', async () => {
      const userData = { email: 'user@example.com', phone: '1234567890', username: 'user', password: 'password', role: 'admin', status: 'active' };
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { body: userData };

      await userController.createUser(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('deleteUser', () => {
    it('should successfully delete a user', async () => {
      const userId = 1;
      db.execute.mockResolvedValueOnce([{}]); // Mocking user exists
      db.execute.mockResolvedValueOnce([{}]); // Mocking successful deletion

      const req = { params: { id: userId } };

      await userController.deleteUser(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM users WHERE id = ?', [userId]);
      expect(db.execute).toHaveBeenCalledWith('DELETE FROM users WHERE id = ?', [userId]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith("Delete success");
    });

    it('should handle database errors when deleting a user', async () => {
      const userId = 1;
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { id: userId } };

      await userController.deleteUser(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('updateUser', () => {
    it('should successfully update a user', async () => {
      const userId = 1;
      const userData = { username: 'user', email: 'user@example.com', password: 'password', role: 'admin', phone: '1234567890', status: 'active' };
      db.execute.mockResolvedValueOnce([[]]); // Mocking email does not exist
      db.execute.mockResolvedValueOnce([{}]); // Mocking successful update

      const req = { params: { id: userId }, body: userData };

      await userController.updateUser(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM users WHERE email = ? AND id != ?', [userData.email, userId]);
      expect(db.execute).toHaveBeenCalledWith(
        'UPDATE users SET username = ?, email = ?, password = ?, role = ?, phone = ?, status = ? WHERE id = ?',
        [userData.username, userData.email, userData.password, userData.role, userData.phone, userData.status, userId]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith("Update success");
    });

    it('should handle database errors when updating a user', async () => {
      const userId = 1;
      const userData = { username: 'user', email: 'user@example.com', password: 'password', role: 'admin', phone: '1234567890', status: 'active' };
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { id: userId }, body: userData };

      await userController.updateUser(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('logout', () => {
    it('should successfully logout a user', async () => {
      const req = {};

      await userController.logout(req, mockResponse);

      // Since the logout function is empty, there's nothing to assert here.
      // You might want to add some logic to the function, like clearing the user's session or invalidating their JWT.
    });
  });

  describe('searchUserByEmail', () => {
    it('should successfully search users by email', async () => {
      const email = 'user@example.com';
      const mockUsers = [{ id: 1, email: 'user1@example.com', username: 'user1', role: 'admin', status: 'active' }];
      db.execute.mockResolvedValueOnce([mockUsers]); // Mocking users exist

      const req = { query: { page: 1, limit: 10, email } };

      await userController.searchUserByEmail(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM users WHERE email LIKE ? LIMIT ?, ?', [`%${email}%`, 0, 10]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockUsers });
    });

    it('should handle database errors when searching users by email', async () => {
      const email = 'user@example.com';
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { query: { page: 1, limit: 10, email } };

      await userController.searchUserByEmail(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: mockError.message });
    });
  });

  describe('getProfile', () => {
    it('should successfully get a user profile', async () => {
      const mockToken = { id: 1, email: 'user@example.com', username: 'user', role: 'admin', status: 'active' };
      jwt.verify.mockImplementationOnce((token, key, callback) => callback(null, mockToken)); // Mocking successful verification

      const req = { headers: { authorization: 'Bearer token' } };

      await userController.getProfile(req, mockResponse);

      expect(jwt.verify).toHaveBeenCalledWith(req.headers.authorization, _const.JWT_ACCESS_KEY, expect.any(Function));
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockToken);
    });

    it('should handle verification errors when getting a user profile', async () => {
      const mockError = new Error('Verification error');
      jwt.verify.mockImplementationOnce((token, key, callback) => callback(mockError, null)); // Mocking verification error

      const req = { headers: { authorization: 'Bearer token' } };

      await userController.getProfile(req, mockResponse);

      expect(jwt.verify).toHaveBeenCalledWith(req.headers.authorization, _const.JWT_ACCESS_KEY, expect.any(Function));
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith('Unauthorized');
    });
  });

  describe('updateProfile', () => {
    it('should successfully update a user profile', async () => {
      const userId = 1;
      const userData = { username: 'user', email: 'user@example.com', phone: '1234567890', status: 'active' };
      db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]); // Mocking successful update

      const req = { params: { id: userId }, body: userData };

      await userController.updateProfile(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'UPDATE users SET username = ?, email = ?, phone = ?, status = ? WHERE id = ?',
        [userData.username, userData.email, userData.phone, userData.status, userId]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith("Profile updated successfully");
    });

    it('should handle database errors when updating a user profile', async () => {
      const userId = 1;
      const userData = { username: 'user', email: 'user@example.com', phone: '1234567890', status: 'active' };
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { id: userId }, body: userData };

      await userController.updateProfile(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('changePassword', () => {
    it('should successfully change a user password', async () => {
      const userId = 1;
      const passwordData = { currentPassword: 'password', newPassword: 'newPassword' };
      const hashedPassword = await bcrypt.hash(passwordData.currentPassword, 10);
      const hashedNewPassword = await bcrypt.hash(passwordData.newPassword, 10);
      db.execute.mockResolvedValueOnce([[{ password: hashedPassword }]]); // Mocking user exists
      bcrypt.compare.mockResolvedValueOnce(true); // Mocking password is valid
      db.execute.mockResolvedValueOnce([{}]); // Mocking successful update

      const req = { params: { id: userId }, body: passwordData };

      await userController.changePassword(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM users WHERE id = ?', [userId]);
      expect(bcrypt.compare).toHaveBeenCalledWith(passwordData.currentPassword, hashedPassword);
      expect(db.execute).toHaveBeenCalledWith('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, userId]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith("Password changed successfully");
    });

    it('should handle database errors when changing a user password', async () => {
      const userId = 1;
      const passwordData = { currentPassword: 'password', newPassword: 'newPassword' };
      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      const req = { params: { id: userId }, body: passwordData };

      await userController.changePassword(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });
});