const db = require('../config/db');

const assetEventController = {
    // Ghi lịch sử mua tài sản
    purchaseAsset: async (req, res) => {
        try {
            const { asset_id, event_date, description, quantity } = req.body;

            // Thêm dữ liệu vào bảng asset_event_history
            const query = 'INSERT INTO asset_event_history (asset_id, event_type, event_date, description, quantity) VALUES (?, ?, ?, ?, ?)';
            await db.execute(query, [asset_id, 'purchase', event_date, description, quantity]);

            // Cập nhật số lượng tài sản trong bảng assets
            const updateQuery = 'UPDATE assets SET quantity = quantity + ? WHERE id = ?';
            await db.execute(updateQuery, [quantity, asset_id]);

            res.status(201).json({ message: 'Asset purchase recorded successfully' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Ghi lịch sử bán tài sản
    sellAsset: async (req, res) => {
        try {
            const { asset_id, event_date, description, quantity } = req.body;

            // Kiểm tra số lượng hiện có
            const assetQuery = 'SELECT quantity FROM assets WHERE id = ?';
            const [assetData] = await db.execute(assetQuery, [asset_id]);
            const currentQuantity = assetData[0].quantity;

            if (quantity > currentQuantity) {
                return res.status(200).json({ message: 'Not enough assets to sell' });
            }

            // Thêm dữ liệu vào bảng asset_event_history
            const query = 'INSERT INTO asset_event_history (asset_id, event_type, event_date, description, quantity) VALUES (?, ?, ?, ?, ?)';
            await db.execute(query, [asset_id, 'sell', event_date, description, quantity]);

            // Cập nhật số lượng tài sản trong bảng assets
            const updateQuery = 'UPDATE assets SET quantity = quantity - ? WHERE id = ?';
            await db.execute(updateQuery, [quantity, asset_id]);

            res.status(201).json({ message: 'Asset sale recorded successfully' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Ghi lịch sử di chuyển tài sản
    moveAsset: async (req, res) => {
        try {
            const { asset_id, event_date, description } = req.body;

            // Thêm dữ liệu vào bảng asset_event_history
            const query = 'INSERT INTO asset_event_history (asset_id, event_type, event_date, description) VALUES (?, ?, ?, ?)';
            await db.execute(query, [asset_id, 'move', event_date, description]);

            // Cập nhật mô tả tài sản trong bảng assets
            const updateQuery = 'UPDATE assets SET description = ? WHERE id = ?';
            await db.execute(updateQuery, [description, asset_id]);

            res.status(201).json({ message: 'Asset movement recorded successfully' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getAllAssetEvents: async (req, res) => {
        try {
            const query = 'SELECT aeh.*, a.name AS asset_name FROM asset_event_history aeh LEFT JOIN assets a ON aeh.asset_id = a.id';
            const [assetEvents] = await db.execute(query);
            res.status(200).json({ data: assetEvents });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getAssetEventById: async (req, res) => {
        try {
            const eventID = req.params.id;
            const query = 'SELECT * FROM asset_event_history WHERE id = ?';
            const [assetEvent] = await db.execute(query, [eventID]);

            if (assetEvent.length === 0) {
                return res.status(404).json({ message: 'Asset event not found' });
            }

            res.status(200).json({ data: assetEvent[0] });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    deleteAssetEvent: async (req, res) => {
        try {
            const eventID = req.params.id;
            const query = 'DELETE FROM asset_event_history WHERE id = ?';
            await db.execute(query, [eventID]);
            res.status(200).json({ message: 'Asset event deleted successfully' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    searchAssetEvents: async (req, res) => {
        try {
            const { keyword } = req.query;
            const searchTerm = `%${keyword}%`;
            const query = 'SELECT aeh.*, a.name AS asset_name FROM asset_event_history aeh LEFT JOIN assets a ON aeh.asset_id = a.id WHERE aeh.description LIKE ? OR a.name LIKE ?';
            const [assetEvents] = await db.execute(query, [searchTerm, searchTerm]);
            res.status(200).json({ data: assetEvents });
        } catch (err) {
            res.status(500).json(err);
        }
    },
};

module.exports = assetEventController;
