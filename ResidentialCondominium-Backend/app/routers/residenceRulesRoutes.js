const express = require('express');
const router = express.Router();
const residenceRulesController = require('../controllers/residenceRulesController');


// Tìm kiếm Quy định Cư trú dựa trên tiêu đề hoặc nội dung
router.get('/search', residenceRulesController.searchResidenceRules);

// Lấy danh sách tất cả Quy định Cư trú
router.get('/', residenceRulesController.getAllResidenceRules);

// Thêm một Quy định Cư trú mới
router.post('/', residenceRulesController.addResidenceRule);

// Sửa thông tin của một Quy định Cư trú
router.put('/:ruleId', residenceRulesController.updateResidenceRule);

// Xóa một Quy định Cư trú
router.delete('/:ruleId', residenceRulesController.deleteResidenceRule);

// Lấy thông tin của một Quy định Cư trú dựa trên ID
router.get('/:ruleId', residenceRulesController.getResidenceRuleById);


module.exports = router;
