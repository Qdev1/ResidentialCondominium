// assetController.js
const db = require('../config/db');

const assetController = {
    getAllAssets: async (req, res) => {
        try {
            const query = 'SELECT assets.*, asset_categories.name AS category_name FROM assets LEFT JOIN asset_categories ON assets.category_id = asset_categories.id';
            const [assets] = await db.execute(query);
            res.status(200).json({ data: assets });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    createAsset: async (req, res) => {
        try {
            const { name, description, value, location, status, categoryId, quantity } = req.body;
    
            const query = 'INSERT INTO assets (name, description, value, location, status, category_id, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const [result] = await db.execute(query, [name, description, value, location, status, categoryId, quantity]);
            const assetId = result.insertId;
            res.status(201).json({ id: assetId, name, description, value, location, status, categoryId, quantity });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateAsset: async (req, res) => {
        try {
            const assetId = req.params.id;
            const { name, description, value, location, status, categoryId } = req.body;
            const query = 'UPDATE assets SET name = ?, description = ?, value = ?, location = ?, status = ?, category_id = ? WHERE id = ?';
            await db.execute(query, [name, description, value, location, status, categoryId, assetId]);
            res.status(200).json({ message: 'Asset updated successfully' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    deleteAsset: async (req, res) => {
        try {
            const assetId = req.params.id;
            const query = 'DELETE FROM assets WHERE id = ?';
            await db.execute(query, [assetId]);
            res.status(200).json({ message: 'Asset deleted successfully' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

   getAssetById: async (req, res) => {
        try {
            const assetId = req.params.id;
            const query = 'SELECT assets.*, asset_categories.name AS category_name FROM assets LEFT JOIN asset_categories ON assets.category_id = asset_categories.id WHERE assets.id = ?';
            const [asset] = await db.execute(query, [assetId]);

            if (asset.length === 0) {
                return res.status(404).json({ message: 'Asset not found' });
            }

            res.status(200).json({ data: asset[0] });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    searchAssets: async (req, res) => {
        try {
            const { keyword } = req.query;
            const searchTerm = `%${keyword}%`;
            const query = 'SELECT * FROM assets WHERE name LIKE ? OR description LIKE ? OR location LIKE ?';
            const [assets] = await db.execute(query, [searchTerm, searchTerm, searchTerm]);
            res.status(200).json({ data: assets });
        } catch (err) {
            res.status(500).json(err);
        }
    },
};

module.exports = assetController;
