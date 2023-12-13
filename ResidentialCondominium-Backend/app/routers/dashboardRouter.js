const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Định nghĩa các đường dẫn cho dashboard
router.get('/statistics', dashboardController.getStatistics);

module.exports = router;
