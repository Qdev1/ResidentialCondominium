const express = require('express');
const emergencyMaintenanceController = require('../controllers/emergencyMaintenanceController');
const verifyToken = require('../utils/middleware');

const router = express.Router();

router.get('/security-users', verifyToken.checkLogin, emergencyMaintenanceController.getAllSecurityUsers);
router.get('/search', verifyToken.checkLogin, emergencyMaintenanceController.searchEmergencyMaintenance);
router.post('/', verifyToken.checkLogin, emergencyMaintenanceController.createEmergencyMaintenance);
router.put('/:id', verifyToken.checkLogin, emergencyMaintenanceController.updateEmergencyMaintenance);
router.delete('/:id', verifyToken.checkLogin, emergencyMaintenanceController.deleteEmergencyMaintenance);
router.get('/:id', verifyToken.checkLogin, emergencyMaintenanceController.getEmergencyMaintenanceById);
router.get('/', verifyToken.checkLogin, emergencyMaintenanceController.getAllEmergencyMaintenance);

module.exports = router;
