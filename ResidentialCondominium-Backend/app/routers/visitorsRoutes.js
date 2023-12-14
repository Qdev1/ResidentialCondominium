const express = require('express');
const router = express.Router();
const visitorsController = require('../controllers/visitorsController');

// Tìm kiếm khách hàng bằng Citizen ID
router.get('/search', visitorsController.searchVisitorsByKeyword);

// Tìm kiếm danh sách khách hàng
router.get('/', visitorsController.getAllVisitors);

// Thêm một khách hàng mới
router.post('', visitorsController.addVisitor);

// Sửa thông tin của một khách hàng
router.put('/:visitorId', visitorsController.updateVisitor);

// Xóa một khách hàng
router.delete('/:visitorId', visitorsController.deleteVisitor);

// Tìm kiếm khách hàng theo ID
router.get('/:visitorId', visitorsController.getVisitorById);


module.exports = router;
