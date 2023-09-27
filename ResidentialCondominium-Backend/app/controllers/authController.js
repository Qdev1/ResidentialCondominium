const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _const = require('../config/constant');

const authController = {
    registerUser: async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
            const [checkEmailExist] = await db.execute('SELECT * FROM users WHERE email = ?', [req.body.email]);

            if (checkEmailExist.length > 0) {
                return res.status(200).json('Email is exist');
            }

            // Thêm người dùng mới vào cơ sở dữ liệu
            const [rows] = await db.execute(
                'INSERT INTO users (username, email, password, phone, role, status) VALUES (?, ?, ?, ?, ?, ?)',
                [req.body.username, req.body.email, hashed, req.body.phone, req.body.role, req.body.status]
            );

            const user = {
                id: rows.insertId,
                username: req.body.username,
                email: req.body.email,
                phone: req.body.phone,
                role: req.body.role,
                status: req.body.status
            };

            res.status(200).json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json('Register fails');
        }
    },

    login: async (req, res) => {
        try {
            // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu không
            const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [req.body.email]);
            const user = rows[0];

            if (!user) {
                return res.status(400).json({ message: 'Unregistered account!', status: false });
            }

            // So sánh mật khẩu
            const validatePassword = await bcrypt.compare(req.body.password, user.password);

            if (!validatePassword) {
                res.status(400).json({ message: 'Wrong password!', status: false });
            }

            if (user && validatePassword) {
                // Tạo mã thông báo JWT
                const token = jwt.sign({ user: user }, _const.JWT_ACCESS_KEY, { expiresIn: '10h' });

                res.header('Authorization', token);
                res.status(200).json({ user, token, status: true });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    }
};

module.exports = authController;
