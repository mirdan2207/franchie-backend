const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../../../utils/jwt');

const prisma = new PrismaClient();

class AuthService {
  // Регистрация администратора (только для первого админа)
  async registerAdmin(userData) {
    const { email, password } = userData;

    // Проверяем, есть ли уже администраторы в системе
    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN' }
    });

    if (adminCount > 0) {
      throw new Error('Admin registration is not allowed');
    }

    // Проверяем, существует ли пользователь
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем пользователя-администратора
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    // Генерируем токен
    const token = generateToken({ userId: user.id });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  // Вход пользователя
  async login(email, password) {
    // Находим пользователя
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        partner: true,
        employee: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Проверяем пароль
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    // Генерируем токен
    const token = generateToken({ userId: user.id });

    // Формируем ответ в зависимости от роли
    const userResponse = {
      // id: user.id,
      email: user.email,
      role: user.role
    };

    if (user.role === 'PARTNER' && user.partner) {
      userResponse.partner = {
        id: user.partner.id,
        name: user.partner.name,
      };
    }

    if (user.role === 'EMPLOYEE' && user.employee) {
      userResponse.employee = {
        id: user.employee.id,
        name: user.employee.name,
        rating: user.employee.rating,
        position: user.employee.position,
        phone: user.employee.phone,
        telegram: user.employee.telegram,
        experience: user.employee.experience,
        hiredDate: user.employee.hiredDate,
        // locationId: user.employee.locationId
      };
    }

    return {
      user: userResponse,
      token
    };
  }

  // Получение информации о текущем пользователе
  async getCurrentUser(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        partner: true,
        employee: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Формируем ответ в зависимости от роли
    const userResponse = {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };

    if (user.role === 'PARTNER' && user.partner) {
      userResponse.partner = {
        id: user.partner.id,
        firstName: user.partner.firstName,
        lastName: user.partner.lastName,
        phone: user.partner.phone
      };
    }

    if (user.role === 'EMPLOYEE' && user.employee) {
      userResponse.employee = {
        id: user.employee.id,
        name: user.employee.name,
        locationId: user.employee.locationId
      };
    }

    return userResponse;
  }

  // Изменение пароля
  async changePassword(userId, oldPassword, newPassword) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Проверяем старый пароль
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid old password');
    }

    // Хешируем новый пароль
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Обновляем пароль
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return { message: 'Password changed successfully' };
  }
}

module.exports = new AuthService(); 