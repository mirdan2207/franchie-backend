const authMiddleware = require('./authMiddleware');
const roleMiddleware = require('./roleMiddleware');
const logMiddleware = require('./logMiddleware');

module.exports = {
  authMiddleware,
  roleMiddleware,
  logMiddleware
};