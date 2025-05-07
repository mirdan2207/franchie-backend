// Middleware для проверки ролей
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
      try {
        // Проверяем, что пользователь аутентифицирован
        if (!req.user) {
          return res.status(401).json({ message: 'Authentication required' });
        }
  
        // Проверяем, что роль пользователя входит в список разрешенных
        if (!allowedRoles.includes(req.user.role)) {
          return res.status(403).json({ 
            message: 'Access denied. Insufficient permissions.' 
          });
        }
  
        next();
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    };
  };
  
  module.exports = roleMiddleware;