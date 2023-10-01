const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _const = require('../config/constant');

const userController = {
    getAllUsers: async (req, res) => {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const offset = (page - 1) * limit;
    
        try {
            const query = `SELECT * FROM users LIMIT ${offset}, ${limit}`;
    
            const [users] = await db.execute(query);
            res.status(200).json({ data: users });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    

    createUser: async (req, res) => {
        try {
            const inputEmail = req.body.email;
    
            const [checkEmailExist] = await db.execute('SELECT * FROM users WHERE email = ?', [inputEmail]);
    
            if (checkEmailExist.length > 0) {
                return res.status(400).json("User already exists");
            }
    
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
    
            const { email, phone, username, role, status } = req.body;
    
            const values = [email || null, phone || null, username || null, hashed || null, role || null, status || null];
    
            const query = 'INSERT INTO users (email, phone, username, password, role, status) VALUES (?, ?, ?, ?, ?, ?)';
            
            const [result] = await db.execute(query, values);
            const userId = result.insertId;
    
            res.status(200).json({ id: userId, email, phone, username, role, status });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    

    deleteUser: async (req, res) => {
        try {
            const userId = req.params.id;

            const [checkUserExist] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);

            if (checkUserExist.length === 0) {
                return res.status(404).json("User not found");
            }

            const deleteQuery = 'DELETE FROM users WHERE id = ?';
            await db.execute(deleteQuery, [userId]);

            res.status(200).json("Delete success");
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateUser: async (req, res) => {
        try {
            const userId = req.params.id;
            const { username, email, password, role, phone, status } = req.body;
    
            const [checkEmailExist] = await db.execute('SELECT * FROM users WHERE email = ? AND id != ?', [email, userId]);
    
            if (checkEmailExist.length > 0) {
                return res.status(400).json({ message: 'Email already exists' });
            }
    
            const updateQuery = 'UPDATE users SET username = ?, email = ?, password = ?, role = ?, phone = ?, status = ? WHERE id = ?';
    
            const updatedValues = [
                username || null,
                email || null,
                password || null,
                role || null,
                phone || null,
                status || null,
                userId
            ];
    
            const [result] = await db.execute(updateQuery, updatedValues);
    
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            res.status(200).json("Update success");
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    

    logout: async (req, res) => {
    },

    searchUserByEmail: async (req, res) => {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const email = req.query.email;

        const options = {
            page: page,
            limit: limit,
        };

        try {
            const query = 'SELECT * FROM users WHERE email LIKE ? LIMIT ?, ?';
            const offset = (page - 1) * limit;
            const searchTerm = `%${email}%`;

            const [userList] = await db.execute(query, [searchTerm, offset, limit]);
            res.status(200).json({ data: userList });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getProfile: async (req, res) => {
        jwt.verify(req.headers.authorization, _const.JWT_ACCESS_KEY, (err, decodedToken) => {
            if (err) {
                res.status(401).send('Unauthorized');
            } else {
                res.status(200).json(decodedToken);
            }
        });
    },
};

module.exports = userController;
