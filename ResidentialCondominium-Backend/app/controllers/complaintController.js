const db = require('../config/db');

const complaintController = {

    submitComplaint: async (req, res) => {
        try {
            const { user_id, subject, description, assigned_to } = req.body;

            // Kiểm tra xem user_id có tồn tại trong cơ sở dữ liệu không
            const [userRows] = await db.execute('SELECT * FROM users WHERE id = ?', [user_id]);
            const user = userRows[0];

            if (!user) {
                return res.status(400).json({ message: 'User not found', status: false });
            }

            // Lưu thông tin khiếu nại vào cơ sở dữ liệu
            const [complaintRows] = await db.execute(
                'INSERT INTO complaints (user_id, subject, description, status, progress, assigned_to) VALUES (?, ?, ?, ?, ?, ?)',
                [user_id, subject, description, 'pending', 0, assigned_to]
            );

            const complaintId = complaintRows.insertId;

            res.status(201).json({ message: 'Complaint submitted successfully', status: true });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy tất cả thông tin về khiếu nại
    getAllComplaints: async (req, res) => {
        try {
            const query = 'SELECT complaints.*, users.username AS user_name, users.role AS user_role, assigned_users.username AS assigned_to_name, assigned_users.role AS assigned_to_role FROM complaints INNER JOIN users ON complaints.user_id = users.id LEFT JOIN users AS assigned_users ON complaints.assigned_to = assigned_users.id';
            const [complaints] = await db.execute(query);
            res.status(200).json(complaints);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Cập nhật thông tin của một khiếu nại
    updateComplaint: async (req, res) => {
        try {
            const { complaintId } = req.params;
            const { user_id, subject, description, status, progress, assigned_to } = req.body;
            const query = 'UPDATE complaints SET user_id = ?, subject = ?, description = ?, status = ?, progress = ?, assigned_to = ? WHERE id = ?';
            await db.execute(query, [user_id, subject, description, status, progress, assigned_to, complaintId]);
            res.status(200).json({ message: 'Complaint updated successfully', status: true });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Xóa thông tin của một khiếu nại
    deleteComplaint: async (req, res) => {
        try {
            const { complaintId } = req.params;
            const query = 'DELETE FROM complaints WHERE id = ?';
            await db.execute(query, [complaintId]);
            res.status(200).json({ message: 'Complaint deleted successfully', status: true });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy thông tin của một khiếu nại dựa trên ID
    getComplaintById: async (req, res) => {
        try {
            const { complaintId } = req.params;
            const [complaint] = await db.execute('SELECT * FROM complaints WHERE id = ?', [complaintId]);

            if (complaint.length === 0) {
                res.status(404).json({ message: 'Complaint not found', status: false });
            } else {
                res.status(200).json(complaint[0]);
            }
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Tìm kiếm khiếu nại dựa trên tiêu đề
    searchComplaintsBySubject: async (req, res) => {
        try {
            const { subject } = req.query;
    
            const query = 'SELECT complaints.*, users.username AS user_name, assigned_users.username AS assigned_to_name FROM complaints INNER JOIN users ON complaints.user_id = users.id LEFT JOIN users AS assigned_users ON complaints.assigned_to = assigned_users.id WHERE complaints.subject LIKE ?';
            const [complaints] = await db.execute(query, [`%${subject}%`]);
    
            res.status(200).json(complaints);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Gán người đảm nhiệm nhiệm vụ cho khiếu nại
    assignComplaint: async (req, res) => {
        try {
            const { complaintId } = req.params;
            const { assigned_to } = req.body;

            // Kiểm tra xem người đảm nhiệm tồn tại trong cơ sở dữ liệu không
            const [userRows] = await db.execute('SELECT * FROM users WHERE id = ?', [assigned_to]);
            const user = userRows[0];

            if (!user) {
                return res.status(400).json({ message: 'Assigned user not found', status: false });
            }

            // Cập nhật người đảm nhiệm nhiệm vụ cho khiếu nại
            const query = 'UPDATE complaints SET assigned_to = ? WHERE id = ?';
            await db.execute(query, [assigned_to, complaintId]);

            res.status(200).json({ message: 'Complaint assigned successfully', status: true });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
};

module.exports = complaintController;
