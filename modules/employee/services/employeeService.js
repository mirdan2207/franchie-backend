const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class EmployeeService {
    // Получение информации о сотруднике
    async getEmployeeProfile(employeeId) {
        return prisma.employee.findUnique({
            where: {
                id: employeeId
            },
            include: {
                location: {
                    select: {
                        id: true,
                        name: true,
                        address: true
                    }
                },
                user: {
                    select: {
                        email: true,
                        createdAt: true
                    }
                }
            }
        });
    }

    // Получение меню локации
    async getLocationMenu(locationId) {
        return prisma.menu.findMany({
            where: {
                locationId,
                isActive: true
            }
        });
    }

    // Создание заказа
    async createOrder(employeeId, locationId, total) {
        return prisma.order.create({
            data: {
                total,
                locationId,
                employeeId
            }
        });
    }

    // Получение заказов сотрудника
    async getEmployeeOrders(employeeId) {
        return prisma.order.findMany({
            where: {
                employeeId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
}

module.exports = new EmployeeService(); 