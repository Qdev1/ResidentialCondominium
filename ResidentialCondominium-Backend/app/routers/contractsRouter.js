const express = require('express');
const contractController = require('../controllers/contractController');
const verifyToken = require('../utils/middleware');

const router = express.Router();

// Route để tìm kiếm hợp đồng dựa trên các điều kiện
router.get('/search', verifyToken.checkLogin, contractController.searchContracts);

// Route để tạo hợp đồng mới
router.post('/', verifyToken.checkLogin, contractController.createContract);

// Route để cập nhật thông tin hợp đồng theo ID
router.put('/:id', verifyToken.checkLogin, contractController.updateContract);

// Route để xóa hợp đồng theo ID
router.delete('/:id', verifyToken.checkLogin, contractController.deleteContract);

// Route để lấy tất cả hợp đồng
router.get('/', verifyToken.checkLogin, contractController.getAllContracts);

// Route để lấy thông tin hợp đồng theo ID
router.get('/:id', verifyToken.checkLogin, contractController.getContractById);


module.exports = router;
