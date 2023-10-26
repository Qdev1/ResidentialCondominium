const db = require('../config/db');

const complaintController = {
    submitComplaint: async (req, res) => {
        try {
            const { user_id, subject, description } = req.body;

            // Kiểm tra xem user_id có tồn tại trong cơ sở dữ liệu không
            const [userRows] = await db.execute('SELECT * FROM users WHERE id = ?', [user_id]);
            const user = userRows[0];

            if (!user) {
                return res.status(400).json({ message: 'User not found', status: false });
            }

            // Lưu thông tin khiếu nại vào cơ sở dữ liệu
            const [complaintRows] = await db.execute(
                'INSERT INTO complaints (user_id, subject, description) VALUES (?, ?, ?)',
                [user_id, subject, description]
            );

            const complaintId = complaintRows.insertId;

            // Sau khi lưu thông tin khiếu nại, bạn có thể thực hiện các hành động thông báo tới quản lý hoặc cập nhật trạng thái

            res.status(201).json({ message: 'Complaint submitted successfully', status: true });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
};

module.exports = complaintController;
