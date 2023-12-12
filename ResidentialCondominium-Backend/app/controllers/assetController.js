const db = require('../config/db');

const assetCategoryController = {
    getAllAssetCategories: async (req, res) => {
        try {
            const query = 'SELECT * FROM asset_categories';
            const [assetCategories] = await db.execute(query);

            res.status(200).json({ data: assetCategories });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    createAssetCategory: async (req, res) => {
        try {
            const { name, description } = req.body;
            const query = 'INSERT INTO asset_categories (name, description) VALUES (?, ?)';
            const [result] = await db.execute(query, [name, description]);
            const assetCategoryId = result.insertId;
            res.status(201).json({ id: assetCategoryId, name, description });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    deleteAssetCategory: async (req, res) => {
        try {
            const assetCategoryId = req.params.id;
            const query = 'DELETE FROM asset_categories WHERE id = ?';
            await db.execute(query, [assetCategoryId]);
            res.status(200).json({ message: 'Asset category deleted successfully' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateAssetCategory: async (req, res) => {
        try {
            const assetCategoryId = req.params.id;
            const { name, description } = req.body;
            const query = 'UPDATE asset_categories SET name = ?, description = ? WHERE id = ?';
            await db.execute(query, [name, description, assetCategoryId]);
            res.status(200).json({ message: 'Asset category updated successfully' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    searchAssetCategories: async (req, res) => {
        try {
            const { keyword } = req.query;
            const query = 'SELECT * FROM asset_categories WHERE name LIKE ? OR description LIKE ?';
            const searchTerm = `%${keyword}%`;
            const [assetCategories] = await db.execute(query, [searchTerm, searchTerm]);
            res.status(200).json({ data: assetCategories });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getAssetCategoryById: async (req, res) => {
        try {
          const categoryId = req.params.id;
    
          const query = 'SELECT id, name, description FROM asset_categories WHERE id = ?';
          const [category] = await db.execute(query, [categoryId]);
    
          if (category.length === 0) {
            return res.status(404).json({ message: 'Asset category not found' });
          }
    
          res.status(200).json({ data: category[0] });
        } catch (err) {
          res.status(500).json(err);
        }
      },
};

module.exports = assetCategoryController;
