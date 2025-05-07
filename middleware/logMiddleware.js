const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Middleware для логирования действий
const logMiddleware = async (req, res, next) => {
  // Сохраняем оригинальный метод end
  const originalEnd = res.end;

  // Переопределяем метод end
  res.end = async function (chunk, encoding) {
    try {
      // Если есть пользователь в запросе, логируем действие
      if (req.user) {
        await prisma.log.create({
          data: {
            userId: req.user.id,
            role: req.user.role,
            endpoint: req.originalUrl,
            method: req.method
          }
        });
      }
    } catch (error) {
      console.error('Logging error:', error);
    }

    // Вызываем оригинальный метод end
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

module.exports = logMiddleware;