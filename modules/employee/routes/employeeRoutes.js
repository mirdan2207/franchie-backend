const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authMiddleware } = require('../../../middleware/authMiddleware');
const roleMiddleware = require('../../../middleware/roleMiddleware');
const logMiddleware = require('../../../middleware/logMiddleware');

// Все маршруты требуют аутентификации
router.use(authMiddleware);
router.use(roleMiddleware(['EMPLOYEE']));
router.use(logMiddleware);

// Получение профиля сотрудника
router.get('/profile', employeeController.getProfile);

// Получение меню локации
router.get('/menu', employeeController.getMenu);

// Работа с заказами
router.post('/orders', employeeController.createOrder);
router.get('/orders', employeeController.getOrders);

module.exports = router; 