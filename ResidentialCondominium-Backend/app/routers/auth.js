const authController = require("../controllers/authController");
const registrationController = require('../controllers/registrationController');
const router = require("express").Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post('/register-personal-info', registrationController.registerPersonalInfo);

module.exports = router;