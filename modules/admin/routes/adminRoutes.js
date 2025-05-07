const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const roleMiddleware = require('../../../middleware/roleMiddleware');
const { authMiddleware } = require('../../../middleware/authMiddleware');
const logMiddleware = require('../../../middleware/logMiddleware');

// Проверяем аутентификацию и роль администратора
router.use(authMiddleware);
router.use(roleMiddleware(['ADMIN']));
router.use(logMiddleware);

// Маршруты для работы с партнерами
router.post('/partners', adminController.createPartner);
router.get('/partners', adminController.getPartners);

// Маршруты для работы с локациями
router.post('/locations', adminController.createLocation);
router.get('/locations', adminController.getLocations);

module.exports = router; 