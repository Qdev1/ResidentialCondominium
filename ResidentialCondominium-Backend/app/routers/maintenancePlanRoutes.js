const express = require('express');
const maintenancePlanController = require('../controllers/maintenancePlanController');
const verifyToken = require('../utils/middleware');

const router = express.Router();

// Route để tạo kế hoạch bảo trì
router.post('/', verifyToken.checkLogin, maintenancePlanController.createMaintenancePlan);

// Route để cập nhật kế hoạch bảo trì theo ID
router.put('/:id', verifyToken.checkLogin, maintenancePlanController.updateMaintenancePlan);

// Route để xóa kế hoạch bảo trì theo ID
router.delete('/:id', verifyToken.checkLogin, maintenancePlanController.deleteMaintenancePlan);

// Route để lấy tất cả kế hoạch bảo trì cho một tài sản cụ thể
router.get('/:assetId', verifyToken.checkLogin, maintenancePlanController.getMaintenancePlansForAsset);

module.exports = router;
