const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');

// Tuyến đường để gửi khiếu nại
router.post('/submit', complaintController.submitComplaint);

module.exports = router;
