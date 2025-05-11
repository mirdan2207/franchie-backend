const client = require('prom-client');

const register = new client.Registry();

// Настройка временных меток
const now = Date.now();
client.collectDefaultMetrics({
    app: 'franchie-app',
    prefix: 'franchie_',
    timeout: 10000,
    register,
    timestamp: now
  });

const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 2, 5],
    timestamp: now
  });
  
  // Метрики для бизнес-логики
  const activeUsers = new client.Gauge({
    name: 'franchie_active_users',
    help: 'Number of active users',
    timestamp: now
  });
  
  const totalFranchises = new client.Gauge({
    name: 'franchie_total_franchises',
    help: 'Total number of franchises',
    timestamp: now
  });
  
  // Регистрируем метрики
  register.registerMetric(httpRequestDurationMicroseconds);
  register.registerMetric(activeUsers);
  register.registerMetric(totalFranchises);
  
  module.exports = {
    register,
    httpRequestDurationMicroseconds,
    activeUsers,
    totalFranchises
  }; 
