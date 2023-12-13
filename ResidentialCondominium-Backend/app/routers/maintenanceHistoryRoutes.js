const express = require('express');
const maintenanceHistoryController = require('../controllers/maintenanceHistoryController');
const verifyToken = require('../utils/middleware');

const router = express.Router();

router.get('/', verifyToken.checkLogin, maintenanceHistoryController.getAllMaintenanceRecords);

// Route để lấy tất cả bản ghi lịch sử bảo trì cho một kế hoạch bảo trì cụ thể
router.get('/plan/:planId', verifyToken.checkLogin, maintenanceHistoryController.getMaintenanceRecordsForPlan);

// Route để tạo bản ghi lịch sử bảo trì
router.post('/', verifyToken.checkLogin, maintenanceHistoryController.createMaintenanceRecord);

// Route để cập nhật bản ghi lịch sử bảo trì theo ID
router.put('/:id', verifyToken.checkLogin, maintenanceHistoryController.updateMaintenanceRecord);

// Route để xóa bản ghi lịch sử bảo trì theo ID
router.delete('/:id', verifyToken.checkLogin, maintenanceHistoryController.deleteMaintenanceRecord);

// Route để tìm kiếm bản ghi lịch sử bảo trì
router.get('/search', verifyToken.checkLogin, maintenanceHistoryController.searchMaintenanceRecords);

// Route để lấy thông tin chi tiết bản ghi lịch sử bảo trì theo ID
router.get('/:id', verifyToken.checkLogin, maintenanceHistoryController.getMaintenanceRecordById);



module.exports = router;
