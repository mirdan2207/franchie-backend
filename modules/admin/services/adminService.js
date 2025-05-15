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