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
                        rating: true,
                        position: true,
                        phone: true,
                        telegram: true,
                        experience: true,
                        hiredDate: true,
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
    async createOrder(employeeId, locationId, customerName, orderItems) {
        total = 0
        orderItems.forEach(orderItem => {
            total += orderItem.quantity * orderItem.price;
        });
        return prisma.order.create({
            data: {
                customerName,
                total,
                locationId,
                employeeId, 
                orderItems
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