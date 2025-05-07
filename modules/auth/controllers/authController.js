const authService = require('../services/authService');
const { validationResult } = require('express-validator');

class AuthController {
  // Регистрация администратора
  async registerAdmin(req, res) {
    try {
      // Проверяем валидацию
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const result = await authService.registerAdmin(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Вход
  async login(req, res) {
    try {
      // Проверяем валидацию
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  // Получение информации о текущем пользователе
  async getCurrentUser(req, res) {
    try {
      const user = await authService.getCurrentUser(req.user.id);
      res.json(user);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  // Изменение пароля
  async changePassword(req, res) {
    try {
      // Проверяем валидацию
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { oldPassword, newPassword } = req.body;
      const result = await authService.changePassword(
        req.user.id,
        oldPassword,
        newPassword
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new AuthController(); 