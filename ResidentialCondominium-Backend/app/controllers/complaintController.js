const db = require('../config/db');

const complaintController = {

    submitComplaint: async (req, res) => {
        try {
            const { user_id, subject, description, assigned_to, created_by } = req.body;
    
            // Check if user_id and created_by exist in the database
            const [userRows] = await db.execute('SELECT * FROM users WHERE id = ?', [user_id]);
            const [creatorRows] = await db.execute('SELECT * FROM users WHERE id = ?', [created_by]);
    
            const user = userRows[0];
            const creator = creatorRows[0];
    
            if (!user || !creator) {
                return res.status(400).json({ message: 'User or creator not found', status: false });
            }
    
            // Submit the complaint without checking assigned_to
            const [complaintRows] = await db.execute(
                'INSERT INTO complaints (user_id, subject, description, status, progress, assigned_to, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [user_id, subject, description, 'pending', 0, assigned_to, created_by]
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
            const query = 'SELECT complaints.*, users.username AS user_name, users.email AS user_email, users.role AS user_role, assigned_users.username AS assigned_to_name, assigned_users.email AS assigned_to_email, assigned_users.role AS assigned_to_role FROM complaints INNER JOIN users ON complaints.user_id = users.id LEFT JOIN (SELECT id, username, email, role FROM users) AS assigned_users ON complaints.assigned_to = assigned_users.id';
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
    
            const query = 'SELECT complaints.*, users.username AS user_name, users.email AS user_email, assigned_to_name, assigned_to_email FROM complaints INNER JOIN users ON complaints.user_id = users.id LEFT JOIN (SELECT id, username AS assigned_to_name, email AS assigned_to_email FROM users) AS assigned_users ON complaints.assigned_to = assigned_users.id WHERE complaints.subject LIKE ?';
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
