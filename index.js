require('dotenv').config();
const express = require('express');
const configureApp = require('./config/app');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Configure app
configureApp(app);

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 