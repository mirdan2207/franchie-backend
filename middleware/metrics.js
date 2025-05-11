const { httpRequestDurationMicroseconds } = require('../config/metrics');

const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const route = req.route ? req.route.path : req.path;
    const timestamp = Date.now();
    
    httpRequestDurationMicroseconds
      .labels(req.method, route, res.statusCode.toString())
      .observe(duration / 1000, timestamp); // конвертируем в секунды и добавляем временную метку
  });
  
  next();
};

module.exports = metricsMiddleware;