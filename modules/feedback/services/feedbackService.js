const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class FeedbackService {
    // Создание отзыва
    async createFeedback(rating, comment, employeeId, customerName) {
        // Проверяем валидность рейтинга
        if (rating < 1 || rating > 5) {
            throw new Error('Рейтинг должен быть от 1 до 5');
        }

        return prisma.review.create({
            data: {
                employeeId,
                customerName,
                rating,
                comment,
                // locationId
            }
        });
    }

    // Получение отзывов по локации
    async getLocationFeedbacks(locationId, startDate, endDate) {
        return prisma.review.findMany({
            where: {
                locationId,
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    // Получение статистики по отзывам
    async getFeedbackStatistics(locationId, startDate, endDate) {
        const feedbacks = await prisma.review.findMany({
            where: {
                locationId,
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });

        const totalFeedbacks = feedbacks.length;
        const averageRating = totalFeedbacks > 0
            ? feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / totalFeedbacks
            : 0;

        // Распределение по рейтингам
        const ratingDistribution = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        };

        feedbacks.forEach(feedback => {
            ratingDistribution[feedback.rating]++;
        });

        return {
            totalFeedbacks,
            averageRating,
            ratingDistribution
        };
    }
}

module.exports = new FeedbackService(); 