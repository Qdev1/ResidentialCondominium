// receptionRouter.js

const express = require('express');
const receptionController = require('../controllers/receptionController');
const verifyToken = require('../utils/middleware');

const router = express.Router();

// Route để tạo lịch tiếp đón mới
router.post('/', verifyToken.checkLogin, receptionController.createReception);

// Route để cập nhật thông tin lịch tiếp đón theo ID
router.put('/:id', verifyToken.checkLogin, receptionController.updateReception);

// Route để xóa lịch tiếp đón theo ID
router.delete('/:id', verifyToken.checkLogin, receptionController.deleteReception);

// Route để lấy tất cả lịch tiếp đón
router.get('/', verifyToken.checkLogin, receptionController.getAllReceptions);

// Route để lấy thông tin lịch tiếp đón theo ID
router.get('/:id', verifyToken.checkLogin, receptionController.getReceptionById);

// Route để tìm kiếm lịch tiếp đón
router.get('/search/:query', verifyToken.checkLogin, receptionController.searchReceptions);

module.exports = router;
