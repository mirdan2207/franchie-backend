const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController');
const roleMiddleware = require('../../../middleware/roleMiddleware');
const { authMiddleware } = require('../../../middleware/authMiddleware');
const logMiddleware = require('../../../middleware/logMiddleware');

// Проверяем аутентификацию и роль партнера
router.use(authMiddleware);
router.use(roleMiddleware(['PARTNER']));
router.use(logMiddleware);

// Профиль партнера
router.get('/profile', partnerController.getProfile);

// Маршруты для работы с локациями
router.get('/locations', partnerController.getLocations);

// Маршруты для работы с сотрудниками
router.post('/employees', partnerController.createEmployee);
router.put('employees/:employeeId', partnerController.updateEmployee);
router.delete('/employees/:employeeId', partnerController.deleteEmployee);

// Маршруты для работы с устройствами
router.post('/devices', partnerController.createDeviceCredentials);

// Маршруты для работы с меню
router.get('/menu', partnerController.getMenu);
router.get('/menu/:menuId', partnerController.getMenuItem);
router.post('/menu', partnerController.createMenuItem);
router.put('/menu/:menuId', partnerController.updateMenuItem);
router.delete('/menu/:menuId', partnerController.deleteMenuItem);

// Маршруты для работы с заказами
router.get('/locations/:locationId/employees', partnerController.getEmployees);
router.get('/locations/:locationId/orders', partnerController.getLocationOrders);

// Маршруты для работы с отзывами
router.get('/locations/:locationId/feedbacks', partnerController.getLocationFeedbacks);

// Маршруты для аналитики
router.get('/locations/:locationId/analytics', partnerController.getLocationAnalytics);

// Статистика локации
router.get('/locations/:locationId/statistics', partnerController.getLocationStatistics);

module.exports = router; 