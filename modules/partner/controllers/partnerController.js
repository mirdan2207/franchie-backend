const partnerService = require('../services/partnerService');

class PartnerController {
    async getLocations(req, res) {
        try {
            if (!req.user.partner) {
                return res.status(403).json({ error: 'Доступ запрещен. Требуются права партнера' });
            }
            const partnerId = req.user.partner.id;
            const locations = await partnerService.getPartnerLocations(partnerId);
            res.json(locations);
        } catch (error) {
            console.error('Error getting locations:', error);
            res.status(500).json({ error: 'Ошибка при получении списка локаций' });
        }
    }

    async getLocationStatistics(req, res) {
        try {
            const partnerId = req.user.partner.id;
            const { locationId } = req.params;
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return res.status(400).json({ error: 'Необходимо указать даты начала и конца периода' });
            }

            // Преобразуем строки в объекты Date
            const start = new Date(startDate);
            const end = new Date(endDate);

            // Проверяем валидность дат
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).json({ error: 'Некорректный формат даты. Используйте формат YYYY-MM-DD' });
            }

            // Проверяем, что начальная дата не позже конечной
            if (start > end) {
                return res.status(400).json({ error: 'Дата начала не может быть позже даты окончания' });
            }

            const statistics = await partnerService.getLocationStatistics(locationId, partnerId, start, end);
            res.json(statistics);
        } catch (error) {
            console.error('Error getting location statistics:', error);
            if (error.message === 'Локация не найдена или не принадлежит партнеру') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Ошибка при получении статистики' });
        }
    }

    async getProfile(req, res) {
        try {
            if (!req.user.partner) {
                return res.status(403).json({ error: 'Доступ запрещен. Требуются права партнера' });
            }
            const partnerId = req.user.partner.id;
            const profile = await partnerService.getPartnerProfile(partnerId);
            res.json(profile);
        } catch (error) {
            console.error('Error getting partner profile:', error);
            res.status(500).json({ error: 'Ошибка при получении профиля партнера' });
        }
    }

    // Управление сотрудниками
    async createEmployee(req, res) {
        try {
            if (!req.user.partner) {
                return res.status(403).json({ error: 'Доступ запрещен. Требуются права партнера' });
            }
            const partnerId = req.user.partner.id;
            const { locationId, email, name, password, position, phone, telegram, experience, hiredDate, rating } = req.body;

            if (!locationId || !email || !name || !password || !position || !hiredDate) {
                return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
            }

            const employee = await partnerService.createEmployee(partnerId, locationId, email, name, password, position, phone, telegram, experience, hiredDate, rating);
            res.status(201).json(employee);
        } catch (error) {
            console.error('Error creating employee:', error);
            if (error.message === 'Локация не найдена или не принадлежит партнеру') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Ошибка при создании сотрудника' });
        }
    }

async getEmployees(req, res) {
    try {
        const partnerId = req.user.partner.id;
        const { locationId } = req.params;

        if (!locationId) {
            return res.status(400).json({ error: 'ID локации обязателен' });
        }

        const employees = await partnerService.getEmployees(partnerId, locationId);
        res.json(employees);
    } catch (error) {
        console.error('Error getting employees:', error);
        if (error.message === 'Локация не найдена или не принадлежит партнеру') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Ошибка при получении списка сотрудников' });
    }
}


async updateEmployee(req, res) {
    try {
        const partnerId = req.user.partner.id;
        const { employeeId } = req.params;
        const updateFields = req.body;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: 'Необходимо указать хотя бы одно поле для обновления' });
        }

        const updatedEmployee = await partnerService.updateEmployee(partnerId, employeeId, updateFields);
        res.json(updatedEmployee);
    } catch (error) {
        console.error('Error updating employee:', error);
        if (error.message === 'Сотрудник не найден или не работает в вашей локации') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Ошибка при обновлении данных сотрудника' });
    }
}



    async deleteEmployee(req, res) {
        try {
            const partnerId = req.user.partner.id;
            const { employeeId } = req.params;

            await partnerService.deleteEmployee(partnerId, employeeId);
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting employee:', error);
            if (error.message === 'Сотрудник не найден или не работает в вашей локации') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Ошибка при удалении сотрудника' });
        }
    }

    // Управление устройствами
    async createDeviceCredentials(req, res) {
        try {
            const partnerId = req.user.partner.id;
            const { locationId } = req.body;

            if (!locationId) {
                return res.status(400).json({ error: 'ID локации обязателен' });
            }

            const credentials = await partnerService.createDeviceCredentials(partnerId, locationId);
            res.status(201).json(credentials);
        } catch (error) {
            console.error('Error creating device credentials:', error);
            if (error.message === 'Локация не найдена или не принадлежит партнеру') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Ошибка при создании учетных данных устройства' });
        }
    }

    // Управление меню
    async createMenuItem(req, res) {
        try {
            const partnerId = req.user.partner.id;
            const { locationId, name, price, category, description } = req.body;

            if (!locationId || !name || !price || !category) {
                return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
            }

            const menuItem = await partnerService.createMenuItem(partnerId, locationId, name, price, category, description);
            res.status(201).json(menuItem);
        } catch (error) {
            console.error('Error creating menu item:', error);
            if (error.message === 'Локация не найдена или не принадлежит партнеру') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Ошибка при создании позиции меню' });
        }
    }

    async updateMenuItem(req, res) {
        try {
            const partnerId = req.user.partner.id;
            const { menuId } = req.params;
            const { name, price, isActive, category, description } = req.body;

            if (!name && !price && isActive === undefined && !category && !description) {
                return res.status(400).json({ error: 'Необходимо указать хотя бы одно поле для обновления' });
            }

            const menuItem = await partnerService.updateMenuItem(partnerId, menuId, { name, price, isActive, category, description});
            res.json(menuItem);
        } catch (error) {
            console.error('Error updating menu item:', error);
            if (error.message === 'Позиция меню не найдена или не принадлежит вашей локации') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Ошибка при обновлении позиции меню' });
        }
    }

    async deleteMenuItem(req, res) {
        try {
            const partnerId = req.user.partner.id;
            const { menuId } = req.params;

            await partnerService.deleteMenuItem(partnerId, menuId);
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting menu item:', error);
            if (error.message === 'Позиция меню не найдена или не принадлежит вашей локации') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Ошибка при удалении позиции меню' });
        }
    }

    // Получение заказов
    async getLocationOrders(req, res) {
        try {
            const partnerId = req.user.partner.id;
            const { locationId } = req.params;
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return res.status(400).json({ error: 'Необходимо указать даты начала и конца периода' });
            }

            // Преобразуем строки в объекты Date
            const start = new Date(startDate);
            const end = new Date(endDate);

            // Проверяем валидность дат
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).json({ error: 'Некорректный формат даты. Используйте формат YYYY-MM-DD' });
            }

            // Проверяем, что начальная дата не позже конечной
            if (start > end) {
                return res.status(400).json({ error: 'Дата начала не может быть позже даты окончания' });
            }

            const orders = await partnerService.getLocationOrders(partnerId, locationId, start, end);
            res.json(orders);
        } catch (error) {
            console.error('Error getting location orders:', error);
            if (error.message === 'Локация не найдена или не принадлежит партнеру') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Ошибка при получении заказов' });
        }
    }

    // Получение отзывов
    async getLocationFeedbacks(req, res) {
        try {
            const partnerId = req.user.partner.id;
            const { locationId } = req.params;
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return res.status(400).json({ error: 'Необходимо указать даты начала и конца периода' });
            }

            // Преобразуем строки в объекты Date
            const start = new Date(startDate);
            const end = new Date(endDate);

            // Проверяем валидность дат
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).json({ error: 'Некорректный формат даты. Используйте формат YYYY-MM-DD' });
            }

            // Проверяем, что начальная дата не позже конечной
            if (start > end) {
                return res.status(400).json({ error: 'Дата начала не может быть позже даты окончания' });
            }

            const feedbacks = await partnerService.getLocationFeedbacks(partnerId, locationId, start, end);
            res.json(feedbacks);
        } catch (error) {
            console.error('Error getting location feedbacks:', error);
            if (error.message === 'Локация не найдена или не принадлежит партнеру') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Ошибка при получении отзывов' });
        }
    }

    // Получение аналитики
    async getLocationAnalytics(req, res) {
        try {
            const partnerId = req.user.partner.id;
            const { locationId } = req.params;
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return res.status(400).json({ error: 'Необходимо указать даты начала и конца периода' });
            }

            // Преобразуем строки в объекты Date
            const start = new Date(startDate);
            const end = new Date(endDate);

            // Проверяем валидность дат
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).json({ error: 'Некорректный формат даты. Используйте формат YYYY-MM-DD' });
            }

            // Проверяем, что начальная дата не позже конечной
            if (start > end) {
                return res.status(400).json({ error: 'Дата начала не может быть позже даты окончания' });
            }

            const analytics = await partnerService.getLocationAnalytics(partnerId, locationId, start, end);
            res.json(analytics);
        } catch (error) {
            console.error('Error getting location analytics:', error);
            if (error.message === 'Локация не найдена или не принадлежит партнеру') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Ошибка при получении аналитики' });
        }
    }

    // Получение всего меню партнера
    async getMenu(req, res) {
        try {
            if (!req.user.partner) {
                return res.status(403).json({ error: 'Доступ запрещен. Требуются права партнера' });
            }
            const partnerId = req.user.partner.id;
            const menu = await partnerService.getPartnerMenu(partnerId);
            res.json(menu);
        } catch (error) {
            console.error('Error getting partner menu:', error);
            res.status(500).json({ error: 'Ошибка при получении меню' });
        }
    }

    // Получение конкретной позиции меню
    async getMenuItem(req, res) {
        try {
            if (!req.user.partner) {
                return res.status(403).json({ error: 'Доступ запрещен. Требуются права партнера' });
            }
            const partnerId = req.user.partner.id;
            const { menuId } = req.params;

            const menuItem = await partnerService.getMenuItem(partnerId, menuId);
            res.json(menuItem);
        } catch (error) {
            console.error('Error getting menu item:', error);
            if (error.message === 'Позиция меню не найдена или не принадлежит вашей локации') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Ошибка при получении позиции меню' });
        }
    }
}

module.exports = new PartnerController(); 