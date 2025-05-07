const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const authMiddleware = require('../../../middleware/authMiddleware');
const logMiddleware = require('../../../middleware/logMiddleware');

router.use(logMiddleware);

// Публичный маршрут для создания отзыва
router.post('/', feedbackController.createFeedback);

// Защищенные маршруты (требуют аутентификации)
router.use(authMiddleware);

// Получение отзывов по локации
router.get('/location/:locationId', feedbackController.getLocationFeedbacks);

// Получение статистики по отзывам
router.get('/location/:locationId/statistics', feedbackController.getFeedbackStatistics);

module.exports = router; 