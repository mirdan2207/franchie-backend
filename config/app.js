const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const configureApp = (app) => {
  // Middleware
  app.use(cors());
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  }));
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

module.exports = configureApp; 