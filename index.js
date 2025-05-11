require('dotenv').config();
const express = require('express');
const configureApp = require('./config/app');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const metricsMiddleware = require('./middleware/metrics');
const { register } = require('./config/metrics');

const app = express();

configureApp(app);

app.use(metricsMiddleware);

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});


// Routes
app.use('/', routes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 