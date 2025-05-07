const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../../../middleware/authMiddleware');
const {
  registerAdminValidators,
  loginValidators,
  changePasswordValidators
} = require('../validators/authValidators');

// Публичные роуты
router.post('/register/admin', registerAdminValidators, authController.registerAdmin);
router.post('/login', loginValidators, authController.login);

// Защищенные роуты
router.get('/me', authMiddleware, authController.getCurrentUser);
router.post(
  '/change-password',
  authMiddleware,
  changePasswordValidators,
  authController.changePassword
);

module.exports = router; 