const db = require('../config/db');

const visitorsController = {
    // Lấy tất cả thông tin về khách hàng
    getAllVisitors: async (req, res) => {
        try {
            const [visitors] = await db.execute('SELECT * FROM visitors');
            res.status(200).json(visitors);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Thêm một khách hàng mới
    addVisitor: async (req, res) => {
        try {
            const { name, email, phone, entryDate, reasonToVisit, citizenId } = req.body;
            const query = 'INSERT INTO visitors (name, email, phone, entryDate, reasonToVisit, citizenId) VALUES (?, ?, ?, ?, ?, ?)';
            await db.execute(query, [name, email, phone, entryDate, reasonToVisit, citizenId]);
            res.status(201).json({ message: 'Visitor added successfully', status: true });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Cập nhật thông tin của một khách hàng
    updateVisitor: async (req, res) => {
        try {
            const { visitorId } = req.params;
            const { name, email, phone, entryDate, reasonToVisit, citizenId } = req.body;
            const query = 'UPDATE visitors SET name = ?, email = ?, phone = ?, entryDate = ?, reasonToVisit = ?, citizenId = ? WHERE id = ?';
            await db.execute(query, [name, email, phone, entryDate, reasonToVisit, citizenId, visitorId]);
            res.status(200).json({ message: 'Visitor updated successfully', status: true });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Xóa thông tin của một khách hàng
    deleteVisitor: async (req, res) => {
        try {
            const { visitorId } = req.params;
            const query = 'DELETE FROM visitors WHERE id = ?';
            await db.execute(query, [visitorId]);
            res.status(200).json({ message: 'Visitor deleted successfully', status: true });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy thông tin của một khách hàng dựa trên id
    getVisitorById: async (req, res) => {
        try {
            const { visitorId } = req.params;
            const [visitor] = await db.execute('SELECT * FROM visitors WHERE id = ?', [visitorId]);

            if (visitor.length === 0) {
                res.status(404).json({ message: 'Visitor not found', status: false });
            } else {
                res.status(200).json(visitor[0]);
            }
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

      // Tìm kiếm khách hàng dựa trên số căn cước công dân
      searchVisitorsByCitizenId: async (req, res) => {
        try {
            const { citizenId } = req.query;

            if (!citizenId) {
                return res.status(400).json({ message: 'CitizenId is required', status: false });
            }

            const query = 'SELECT * FROM visitors WHERE citizen_id = ?';
            const [visitors] = await db.execute(query, [citizenId]);

            if (visitors.length === 0) {
                res.status(404).json({ message: 'No visitors found with the specified CitizenId', status: false });
            } else {
                res.status(200).json(visitors);
            }
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    }


};

module.exports = visitorsController;

