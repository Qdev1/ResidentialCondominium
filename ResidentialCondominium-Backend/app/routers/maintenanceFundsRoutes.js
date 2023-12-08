// routes.js
const express = require('express');
const router = express.Router();
const maintenanceFundsController = require('../controllers/maintenanceFundsController');

// Tuyến đường cho quản lý quỹ bảo trì
router.get('/', maintenanceFundsController.getAllFunds);
router.get('/:fundId', maintenanceFundsController.getFundById);
router.post('/', maintenanceFundsController.createFund);
router.put('/:fundId', maintenanceFundsController.updateFund);
router.delete('/:fundId', maintenanceFundsController.deleteFund);
router.get('/search', maintenanceFundsController.searchFundsByDescription);

module.exports = router;
