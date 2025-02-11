const config = require('./utils/config');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const path = require('path');

mongoose.set('strictQuery', false);

logger.info('connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB: ', error.message);
  });

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));
app.use(middleware.requestLogger);

// API Routes
app.use('/api/login', loginRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);

// Only for test environment
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing');
  app.use('/api/testing', testingRouter);
}

// Error handling middleware
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

module.exports = app;
