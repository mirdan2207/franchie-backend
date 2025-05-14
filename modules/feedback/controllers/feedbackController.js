const feedbackService = require('../services/feedbackService');

class FeedbackController {
    // Создание отзыва
    async createFeedback(req, res) {
        try {
            const { rating, comment, employeeId, customerName } = req.body;

            if (!employeeId || !rating || !comment || !customerName) {
                return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
            }

            const feedback = await feedbackService.createFeedback(rating, comment, employeeId, customerName);
            res.status(201).json(feedback);
        } catch (error) {
            console.error('Error creating feedback:', error);
            if (error.message === 'Рейтинг должен быть от 1 до 5') {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Ошибка при создании отзыва' });
        }
    }

    // Получение отзывов по локации
    async getLocationFeedbacks(req, res) {
        try {
            const { locationId } = req.params;
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return res.status(400).json({ error: 'Необходимо указать даты начала и конца периода' });
            }

            // Преобразуем строки в объекты Date
            const start = new Date(startDate);
            const end = new Date(endDate);

            // Проверяем валидность дат
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).json({ error: 'Некорректный формат даты. Используйте формат YYYY-MM-DD' });
            }

            // Проверяем, что начальная дата не позже конечной
            if (start > end) {
                return res.status(400).json({ error: 'Дата начала не может быть позже даты окончания' });
            }

            const feedbacks = await feedbackService.getLocationFeedbacks(locationId, start, end);
            res.json(feedbacks);
        } catch (error) {
            console.error('Error getting location feedbacks:', error);
            res.status(500).json({ error: 'Ошибка при получении отзывов' });
        }
    }

    // Получение статистики по отзывам
    async getFeedbackStatistics(req, res) {
        try {
            const { locationId } = req.params;
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return res.status(400).json({ error: 'Необходимо указать даты начала и конца периода' });
            }

            // Преобразуем строки в объекты Date
            const start = new Date(startDate);
            const end = new Date(endDate);

            // Проверяем валидность дат
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).json({ error: 'Некорректный формат даты. Используйте формат YYYY-MM-DD' });
            }

            // Проверяем, что начальная дата не позже конечной
            if (start > end) {
                return res.status(400).json({ error: 'Дата начала не может быть позже даты окончания' });
            }

            const statistics = await feedbackService.getFeedbackStatistics(locationId, start, end);
            res.json(statistics);
        } catch (error) {
            console.error('Error getting feedback statistics:', error);
            res.status(500).json({ error: 'Ошибка при получении статистики отзывов' });
        }
    }
}

module.exports = new FeedbackController(); 