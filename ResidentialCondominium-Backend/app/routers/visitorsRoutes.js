const express = require('express');
const router = express.Router();
const visitorsController = require('../controllers/visitorsController');

// Tìm kiếm danh sách khách hàng
router.get('', visitorsController.searchVisitorsByCitizenId);

// Thêm một khách hàng mới
router.post('', visitorsController.addVisitor);

// Sửa thông tin của một khách hàng
router.put('/:visitorId', visitorsController.updateVisitor);

// Xóa một khách hàng
router.delete('/:visitorId', visitorsController.deleteVisitor);

// Tìm kiếm khách hàng theo ID
router.get('/:visitorId', visitorsController.getVisitorById);

// Tìm kiếm khách hàng bằng Citizen ID
router.get('/search', visitorsController.searchVisitorsByCitizenId);

module.exports = router;
