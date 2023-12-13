const express = require('express');
const entryController = require('../controllers/entryController');
const verifyToken = require('../utils/middleware');

const router = express.Router();

// Route để tìm kiếm thông tin ra vào
router.get('/search', verifyToken.checkLogin, entryController.searchEntryRecords);

// Route để lấy tất cả thông tin ra vào
router.get('/', verifyToken.checkLogin, entryController.getAllEntryRecords);

// Route để lấy thông tin ra vào theo ID
router.get('/:id', verifyToken.checkLogin, entryController.getEntryRecordById);

// Route để xóa thông tin ra vào theo ID
router.delete('/:id', verifyToken.checkLogin, entryController.deleteEntryRecord);

// Route để tạo thông tin ra vào mới
router.post('/', verifyToken.checkLogin, entryController.createEntryRecord);

// Route để cập nhật thông tin ra vào theo ID
router.put('/:id', verifyToken.checkLogin, entryController.updateEntryRecord);

module.exports = router;
