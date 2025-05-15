const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

class PartnerService {
    async getPartnerLocations(partnerId) {
        return prisma.location.findMany({
            where: {
                partnerId
            },
            include: {
                employees: {
                    select: {
                        id: true,
                        name: true,
                        user: {
                            select: {
                                email: true
                            }
                        }
                    }
                },
                devices: true,
                menus: true
            }
        });
    }

    async getLocationStatistics(locationId, partnerId, startDate, endDate) {
        console.log(locationId, partnerId);
        // Проверяем, что локация принадлежит партнеру
        const location = await prisma.location.findFirst({
            where: {
                id: locationId,
                partnerId
            }
        });

        if (!location) {
            throw new Error('Локация не найдена или не принадлежит партнеру');
        }

        // Получаем статистику по заказам
        const orders = await prisma.order.findMany({
            where: {
                locationId,
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                employee: true
            }
        });

        // Получаем статистику по отзывам
        const feedbacks = await prisma.review.findMany({
            where: {
                locationId,
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });

        // Рассчитываем статистику
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const averageRating = feedbacks.length > 0 
            ? feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbacks.length 
            : 0;

        return {
            totalOrders,
            totalRevenue,
            averageRating,
            orders,
            feedbacks
        };
    }

    async getPartnerProfile(partnerId) {
        return prisma.partner.findUnique({
            where: {
                id: partnerId
            },
            include: {
                user: {
                    select: {
                        email: true,
                        createdAt: true
                    }
                },
                locations: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        _count: {
                            select: {
                                employees: true,
                                devices: true,
                                menus: true
                            }
                        }
                    }
                }
            }
        });
    }

    // Управление сотрудниками
    async createEmployee(partnerId, locationId, email, name, password, position, phone, telegram, experience, hiredDate) {
        // Проверяем, что локация принадлежит партнеру
        const location = await prisma.location.findFirst({
            where: {
                id: locationId,
                partnerId
            }
        });

        if (!location) {
            throw new Error('Локация не найдена или не принадлежит партнеру');
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создаем пользователя и сотрудника
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: 'EMPLOYEE',
                employee: {
                    create: {
                        name,
                        locationId,
                        position, 
                        phone, 
                        telegram, 
                        experience, 
                        hiredDate
                    }
                }
            },
            include: {
                employee: true
            }
        });

        return user;
    }

// Получить всех сотрудников по всем локациям партнера
async getEmployees(partnerId) {
    return prisma.employee.findMany({
        where: {
            location: {
                partnerId: partnerId, // 👈 условие по связи через location
            },
        },
        include: {
            location: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
}


    // Обновление данных сотрудника
async updateEmployee(partnerId, employeeId, updateData) {
    const employee = await prisma.employee.findFirst({
        where: {
            id: employeeId,
            location: {
                partnerId: partnerId, // 👈 опять же — фильтр по связанной локации
            },
        },
    });

    if (!employee) {
        throw new Error('Сотрудник не найден или не принадлежит вашей локации');
    }

    return prisma.employee.update({
        where: {
            id: employeeId,
        },
        data: updateData,
    });
}

    async deleteEmployee(partnerId, employeeId) {
        // Проверяем, что сотрудник работает в локации партнера
        const employee = await prisma.employee.findFirst({
            where: {
                id: employeeId,
                location: {
                    partnerId
                }
            },
            include: {
                user: true
            }
        });

        if (!employee) {
            throw new Error('Сотрудник не найден или не работает в вашей локации');
        }

        // Удаляем сотрудника и его пользователя
        await prisma.employee.delete({
            where: {
                id: employeeId
            }
        });

        await prisma.user.delete({
            where: {
                id: employee.user.id
            }
        });

        return true;
    }

    // Управление устройствами (планшетами)
    async createDeviceCredentials(partnerId, locationId) {
        // Проверяем, что локация принадлежит партнеру
        const location = await prisma.location.findFirst({
            where: {
                id: locationId,
                partnerId
            }
        });

        if (!location) {
            throw new Error('Локация не найдена или не принадлежит партнеру');
        }

        // Генерируем случайные логин и пароль
        const login = `device_${Math.random().toString(36).substring(2, 8)}`;
        const password = Math.random().toString(36).substring(2, 12);
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создаем устройство
        const device = await prisma.device.create({
            data: {
                login,
                password: hashedPassword,
                locationId
            }
        });

        return {
            ...device,
            password // Возвращаем незахешированный пароль для передачи пользователю
        };
    }

    // Управление меню
    async createMenuItem(partnerId, locationId, name, price, category, description) {
        // Проверяем, что локация принадлежит партнеру
        const location = await prisma.location.findFirst({
            where: {
                id: locationId,
                partnerId
            }
        });

        if (!location) {
            throw new Error('Локация не найдена или не принадлежит партнеру');
        }

        return prisma.menu.create({
            data: {
                name,
                price,
                locationId,
                category,
                description
            }
        });
    }

    async updateMenuItem(partnerId, menuId, data) {
        // Проверяем, что позиция меню принадлежит локации партнера
        const menuItem = await prisma.menu.findFirst({
            where: {
                id: menuId,
                location: {
                    partnerId
                }
            }
        });

        if (!menuItem) {
            throw new Error('Позиция меню не найдена или не принадлежит вашей локации');
        }

        return prisma.menu.update({
            where: {
                id: menuId
            },
            data
        });
    }

    async deleteMenuItem(partnerId, menuId) {
        // Проверяем, что позиция меню принадлежит локации партнера
        const menuItem = await prisma.menu.findFirst({
            where: {
                id: menuId,
                location: {
                    partnerId
                }
            }
        });

        if (!menuItem) {
            throw new Error('Позиция меню не найдена или не принадлежит вашей локации');
        }

        return prisma.menu.delete({
            where: {
                id: menuId
            }
        });
    }

    // Получение заказов
    async getLocationOrders(partnerId, locationId, startDate, endDate) {
        // Проверяем, что локация принадлежит партнеру
        const location = await prisma.location.findFirst({
            where: {
                id: locationId,
                partnerId
            }
        });

        if (!location) {
            throw new Error('Локация не найдена или не принадлежит партнеру');
        }

        return prisma.order.findMany({
            where: {
                locationId,
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                employee: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    // Получение отзывов
    async getLocationFeedbacks(partnerId, locationId, startDate, endDate) {
        // Проверяем, что локация принадлежит партнеру
        const location = await prisma.location.findFirst({
            where: {
                id: locationId,
                partnerId
            }
        });

        if (!location) {
            throw new Error('Локация не найдена или не принадлежит партнеру');
        }

        return prisma.review.findMany({
            where: {
                locationId,
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    // Расширенная аналитика
    async getLocationAnalytics(partnerId, locationId, startDate, endDate) {
        // Проверяем, что локация принадлежит партнеру
        const location = await prisma.location.findFirst({
            where: {
                id: locationId,
                partnerId
            }
        });

        if (!location) {
            throw new Error('Локация не найдена или не принадлежит партнеру');
        }

        // Получаем заказы
        const orders = await prisma.order.findMany({
            where: {
                locationId,
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                employee: true
            }
        });

        // Получаем отзывы
        const feedbacks = await prisma.review.findMany({
            where: {
                locationId,
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });

        // Рассчитываем статистику по дням
        const dailyStats = {};
        orders.forEach(order => {
            const date = order.createdAt.toISOString().split('T')[0];
            if (!dailyStats[date]) {
                dailyStats[date] = {
                    orders: 0,
                    revenue: 0,
                    ratings: []
                };
            }
            dailyStats[date].orders++;
            dailyStats[date].revenue += order.total;
        });

        feedbacks.forEach(feedback => {
            const date = feedback.createdAt.toISOString().split('T')[0];
            if (!dailyStats[date]) {
                dailyStats[date] = {
                    orders: 0,
                    revenue: 0,
                    ratings: []
                };
            }
            dailyStats[date].ratings.push(feedback.rating);
        });

        // Рассчитываем средние показатели по дням
        Object.keys(dailyStats).forEach(date => {
            const stats = dailyStats[date];
            stats.averageRating = stats.ratings.length > 0
                ? stats.ratings.reduce((a, b) => a + b, 0) / stats.ratings.length
                : 0;
            delete stats.ratings;
        });

        // Рассчитываем общую статистику
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const averageRating = feedbacks.length > 0
            ? feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbacks.length
            : 0;

        // Статистика по сотрудникам
        const employeeStats = {};
        orders.forEach(order => {
            const employeeId = order.employee.id;
            if (!employeeStats[employeeId]) {
                employeeStats[employeeId] = {
                    name: order.employee.name,
                    orders: 0,
                    revenue: 0
                };
            }
            employeeStats[employeeId].orders++;
            employeeStats[employeeId].revenue += order.total;
        });

        return {
            totalOrders,
            totalRevenue,
            averageRating,
            dailyStats,
            employeeStats,
            orders,
            feedbacks
        };
    }

    // Получение всего меню партнера
    async getPartnerMenu(partnerId) {
        return prisma.menu.findMany({
            where: {
                location: {
                    partnerId
                },
                isActive: true
            },
            include: {
                location: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: [
                { location: { name: 'asc' } },
                { name: 'asc' }
            ]
        });
    }

    // Получение конкретной позиции меню
    async getMenuItem(partnerId, menuId) {
        const menuItem = await prisma.menu.findFirst({
            where: {
                id: menuId,
                location: {
                    partnerId
                }
            },
            include: {
                location: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        if (!menuItem) {
            throw new Error('Позиция меню не найдена или не принадлежит вашей локации');
        }

        return menuItem;
    }
}

module.exports = new PartnerService(); 