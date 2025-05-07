const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '24h';

// Генерация токена
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Верификация токена
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Извлечение токена из заголовка
const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new Error('No token provided');
  }

  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    throw new Error('Invalid token format');
  }

  return token;
};

module.exports = {
  generateToken,
  verifyToken,
  extractToken
}; 