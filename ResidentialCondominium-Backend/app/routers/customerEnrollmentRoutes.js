// customerEnrollmentRoutes.js

const express = require('express');
const customerEnrollmentController = require('../controllers/customerEnrollmentController');
const verifyToken = require('../utils/middleware');

const router = express.Router();

router.get('/search', verifyToken.checkLogin, customerEnrollmentController.searchCustomers);
router.post('/', verifyToken.checkLogin, customerEnrollmentController.createCustomer);
router.put('/:id', verifyToken.checkLogin, customerEnrollmentController.updateCustomer);
router.delete('/:id', verifyToken.checkLogin, customerEnrollmentController.deleteCustomer);
router.get('/:id', verifyToken.checkLogin, customerEnrollmentController.getCustomerById);
router.get('/', verifyToken.checkLogin, customerEnrollmentController.getAllCustomers);

module.exports = router;
