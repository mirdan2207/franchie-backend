const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

class AdminService {
    async createPartner(email, password, name) {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: 'PARTNER',
                partner: {
                    create: {
                        name
                    }
                }
            },
            include: {
                partner: true
            }
        });

        return user;
    }

    async updatePartner(partnerId, email, password, name) {
    // Получаем партнёра и его пользователя
    const partner = await prisma.partner.findUnique({
        where: { id: partnerId },
        include: { user: true }
    });

    if (!partner) {
        throw new Error('Partner not found');
    }

    const dataToUpdateUser = {};
    const dataToUpdatePartner = {};

    // Обновим email, если он задан
    if (email) {
        dataToUpdateUser.email = email;
    }

    // Обновим пароль, если он задан
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        dataToUpdateUser.password = hashedPassword;
    }

    // Обновим имя партнёра, если оно задано
    if (name) {
        dataToUpdatePartner.name = name;
    }

    // Обновляем пользователя
    if (Object.keys(dataToUpdateUser).length > 0) {
        await prisma.user.update({
            where: { id: partner.userId },
            data: dataToUpdateUser
        });
    }

    // Обновляем партнёра
    if (Object.keys(dataToUpdatePartner).length > 0) {
        await prisma.partner.update({
            where: { id: partnerId },
            data: dataToUpdatePartner
        });
    }

    // Возвращаем обновлённого партнёра с пользователем
    return prisma.partner.findUnique({
        where: { id: partnerId },
        include: {
            user: {
                select: {
                    email: true,
                    createdAt: true
                }
            },
            locations: true
        }
    });
}


    async deletePartner(partnerId) {
    // Проверка: существует ли партнёр
    const partner = await prisma.partner.findUnique({
        where: { id: partnerId },
        include: { user: true }
    });

    if (!partner) {
        throw new Error('Partner not found');
    }

    // Сначала удаляем партнёра
    await prisma.partner.delete({
        where: { id: partnerId }
    });

    // Удаляем сначала пользователя, так как он связан по внешнему ключу
    await prisma.user.delete({
        where: { id: partner.userId }
    });

    return { message: 'Partner and associated user deleted successfully' };
}

    async createLocation(partnerId, name, address) {
        const location = await prisma.location.create({
            data: {
                name,
                address,
                partnerId
            }
        });

        return location;
    }

    // Внутри класса AdminService

async updateLocation(locationId, name, address) {
    const dataToUpdate = {};
    if (name) dataToUpdate.name = name;
    if (address) dataToUpdate.address = address;

    const location = await prisma.location.update({
        where: { id: locationId },
        data: dataToUpdate
    });

    return location;
}

async deleteLocation(locationId) {
    // Проверим, существует ли локация
    const location = await prisma.location.findUnique({
        where: { id: locationId }
    });

    if (!location) {
        throw new Error('Location not found');
    }

    await prisma.location.delete({
        where: { id: locationId }
    });

    return { message: 'Location deleted successfully' };
}


    async getPartners() {
        return prisma.partner.findMany({
            include: {
                user: {
                    select: {
                        email: true,
                        createdAt: true
                    }
                },
                locations: true
            }
        });
    }

    async getLocations() {
        return prisma.location.findMany({
            include: {
                partner: {
                    include: {
                        user: {
                            select: {
                                email: true
                            }
                        }
                    }
                }
            }
        });
    }
}

module.exports = new AdminService(); 