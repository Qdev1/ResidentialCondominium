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
    
            // Kiểm tra xem tên loại tài sản đã tồn tại chưa
            const checkQuery = 'SELECT * FROM asset_categories WHERE name = ?';
            const [checkResult] = await db.execute(checkQuery, [name]);
    
            if (checkResult.length > 0) {
                // Nếu tên đã tồn tại, trả về lỗi
                return res.status(200).json({ error: 'Tên loại tài sản đã tồn tại.' });
            }
    
            // Nếu tên chưa tồn tại, thêm vào cơ sở dữ liệu
            const insertQuery = 'INSERT INTO asset_categories (name, description) VALUES (?, ?)';
            const [result] = await db.execute(insertQuery, [name, description]);
            const assetCategoryId = result.insertId;
            res.status(201).json({ id: assetCategoryId, name, description });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Đã xảy ra lỗi server.' });
        }
    },
    

    deleteAssetCategory: async (req, res) => {
        try {
            const assetCategoryId = req.params.id;
            const query = 'DELETE FROM asset_categories WHERE id = ?';
            await db.execute(query, [assetCategoryId]);
            res.status(200).json({ message: 'Asset category deleted successfully' });
        } catch (err) {
            if (err.code && err.code === 'ER_ROW_IS_REFERENCED_2') {
                // Nếu lỗi là do ràng buộc khóa ngoại
                res.status(200).json({
                    message: 'Cannot delete the asset because it is referenced in another process or event.',
                });
            } else {
                // Nếu lỗi khác
                res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    },

    updateAssetCategory: async (req, res) => {
        try {
            const assetCategoryId = req.params.id;
            const { name, description } = req.body;
    
            // Kiểm tra xem tên loại tài sản đã tồn tại chưa (nếu có thay đổi về tên)
            if (name) {
                const checkQuery = 'SELECT * FROM asset_categories WHERE name = ? AND id != ?';
                const [checkResult] = await db.execute(checkQuery, [name, assetCategoryId]);
    
                if (checkResult.length > 0) {
                    // Nếu tên đã tồn tại, trả về lỗi
                    return res.status(200).json({ error: 'Tên loại tài sản đã tồn tại.' });
                }
            }
    
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
