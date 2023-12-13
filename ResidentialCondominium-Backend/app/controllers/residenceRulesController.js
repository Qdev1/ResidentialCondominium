const db = require('../config/db');

const residenceRulesController = {
  // Lấy danh sách tất cả Quy định Cư trú
  getAllResidenceRules: async (req, res) => {
    try {
      const [rules] = await db.execute('SELECT * FROM residence_rules');
      res.status(200).json(rules);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // Thêm một Quy định Cư trú mới
  addResidenceRule: async (req, res) => {
    try {
      const { title, content } = req.body;
      const query = 'INSERT INTO residence_rules (title, content) VALUES (?, ?)';
      await db.execute(query, [title, content]);
      res.status(201).json({ message: 'Residence rule added successfully', status: true });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // Sửa thông tin của một Quy định Cư trú
  updateResidenceRule: async (req, res) => {
    try {
      const { ruleId } = req.params;
      const { title, content } = req.body;
      const query = 'UPDATE residence_rules SET title = ?, content = ? WHERE id = ?';
      await db.execute(query, [title, content, ruleId]);
      res.status(200).json({ message: 'Residence rule updated successfully', status: true });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // Xóa một Quy định Cư trú
  deleteResidenceRule: async (req, res) => {
    try {
      const { ruleId } = req.params;
      const query = 'DELETE FROM residence_rules WHERE id = ?';
      await db.execute(query, [ruleId]);
      res.status(200).json({ message: 'Residence rule deleted successfully', status: true });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // Lấy thông tin của một Quy định Cư trú dựa trên ID
  getResidenceRuleById: async (req, res) => {
    try {
      const { ruleId } = req.params;
      const [rule] = await db.execute('SELECT * FROM residence_rules WHERE id = ?', [ruleId]);

      if (rule.length === 0) {
        res.status(404).json({ message: 'Residence rule not found', status: false });
      } else {
        res.status(200).json(rule[0]);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // Tìm kiếm Quy định Cư trú dựa trên tiêu đề hoặc nội dung
  searchResidenceRules: async (req, res) => {
    try {
      const { query } = req.query;

      const searchQuery = `%${query}%`;
      const queryStr = 'SELECT * FROM residence_rules WHERE title LIKE ? OR content LIKE ?';
      const [rules] = await db.execute(queryStr, [searchQuery, searchQuery]);

      res.status(200).json(rules);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },
};

module.exports = residenceRulesController;
