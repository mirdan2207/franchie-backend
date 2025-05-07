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