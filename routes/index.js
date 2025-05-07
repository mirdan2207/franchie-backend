const express = require('express');
const router = express.Router();

const authModule = require('../modules/auth');
const adminModule = require('../modules/admin');
const partnerModule = require('../modules/partner');
const employeeModule = require('../modules/employee');
const feedbackModule = require('../modules/feedback');

// Base route
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Franchie API' });
});

// Module routes
router.use('/auth', authModule.routes);
router.use('/admin', adminModule.routes);
router.use('/partner', partnerModule.routes);
router.use('/employee', employeeModule.routes);
router.use('/feedback', feedbackModule.routes);

module.exports = router; 