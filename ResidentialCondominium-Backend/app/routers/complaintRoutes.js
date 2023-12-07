const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');

// Định nghĩa route để gán người đảm nhiệm nhiệm vụ cho khiếu nại
router.put('/:complaintId/assign', complaintController.assignComplaint);

// Tìm kiếm khiếu nại dựa trên tiêu đề
router.get('/search', complaintController.searchComplaintsBySubject);

// Tuyến đường để gửi khiếu nại
router.post('/submit', complaintController.submitComplaint);

// Lấy tất cả thông tin về khiếu nại
router.get('/', complaintController.getAllComplaints);

// Sửa thông tin của một khiếu nại
router.put('/:complaintId', complaintController.updateComplaint);

// Xóa một khiếu nại
router.delete('/:complaintId', complaintController.deleteComplaint);

// Lấy thông tin của một khiếu nại dựa trên ID
router.get('/:complaintId', complaintController.getComplaintById);


module.exports = router;
