const express = require('express');
const assetEventController = require('../controllers/assetEventController');
const verifyToken = require('../utils/middleware');

const router = express.Router();

// Route để ghi lịch sử mua tài sản
router.post('/purchase', verifyToken.checkLogin, assetEventController.purchaseAsset);

// Route để ghi lịch sử bán tài sản
router.post('/sell', verifyToken.checkLogin, assetEventController.sellAsset);

// Route để ghi lịch sử di chuyển tài sản
router.post('/move', verifyToken.checkLogin, assetEventController.moveAsset);

// Route để lấy tất cả sự kiện tài sản
router.get('/', verifyToken.checkLogin, assetEventController.getAllAssetEvents);

// Route để lấy sự kiện tài sản theo ID
router.get('/:id', verifyToken.checkLogin, assetEventController.getAssetEventById);

// Route để xóa sự kiện tài sản theo ID
router.delete('/:id', verifyToken.checkLogin, assetEventController.deleteAssetEvent);

// Route để tìm kiếm sự kiện tài sản theo mô tả
router.get('/search', verifyToken.checkLogin, assetEventController.searchAssetEvents);


module.exports = router;
