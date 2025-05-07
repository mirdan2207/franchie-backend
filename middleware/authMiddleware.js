const { PrismaClient } = require('@prisma/client');
const { verifyToken } = require('../utils/jwt');

const prisma = new PrismaClient();

// Middleware для проверки аутентификации
const authMiddleware = async (req, res, next) => {
  try {
    // Получаем токен из заголовка
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Проверяем токен
    const decoded = verifyToken(token);

    // Получаем пользователя из базы данных
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId
      },
      select: {
        id: true,
        email: true,
        role: true,
        password: true,
        createdAt: true,
        partner: true,
        employee: true
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Добавляем пользователя в объект запроса
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      partner: user.partner,
      employee: user.employee
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = {
  authMiddleware
};