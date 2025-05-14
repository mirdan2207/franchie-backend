const employeeService = require('../services/employeeService');

class EmployeeController {
    // Получение профиля сотрудника
    async getProfile(req, res) {
        try {
            if (!req.user.employee) {
                return res.status(403).json({ error: 'Доступ запрещен. Требуются права сотрудника' });
            }

            const profile = await employeeService.getEmployeeProfile(req.user.employee.id);
            res.json(profile);
        } catch (error) {
            console.error('Error getting employee profile:', error);
            res.status(500).json({ error: 'Ошибка при получении профиля сотрудника' });
        }
    }

    // Получение меню локации
    async getMenu(req, res) {
        try {
            if (!req.user.employee) {
                return res.status(403).json({ error: 'Доступ запрещен. Требуются права сотрудника' });
            }

            const menu = await employeeService.getLocationMenu(req.user.employee.locationId);
            res.json(menu);
        } catch (error) {
            console.error('Error getting location menu:', error);
            res.status(500).json({ error: 'Ошибка при получении меню' });
        }
    }

    // Создание заказа
    async createOrder(req, res) {
        try {
            if (!req.user.employee) {
                return res.status(403).json({ error: 'Доступ запрещен. Требуются права сотрудника' });
            }

            const { customerName, total, orderItems } = req.body;
            if (!total || total <= 0 || !customerName || !orderItems) {
                return res.status(400).json({ error: 'Некорректная сумма заказа' });
            }

            const order = await employeeService.createOrder(
                req.user.employee.id,
                req.user.employee.locationId,
                customerName,
                orderItems
            );
            res.status(201).json(order);
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({ error: 'Ошибка при создании заказа' });
        }
    }

    // Получение заказов сотрудника
    async getOrders(req, res) {
        try {
            if (!req.user.employee) {
                return res.status(403).json({ error: 'Доступ запрещен. Требуются права сотрудника' });
            }

            const orders = await employeeService.getEmployeeOrders(req.user.employee.id);
            res.json(orders);
        } catch (error) {
            console.error('Error getting employee orders:', error);
            res.status(500).json({ error: 'Ошибка при получении заказов' });
        }
    }
}

module.exports = new EmployeeController(); 