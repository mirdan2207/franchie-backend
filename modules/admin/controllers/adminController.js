const adminService = require('../services/adminService');

class AdminController {
    async createPartner(req, res) {
        try {
            const { email, password, name } = req.body;
            
            if (!email || !password || !name) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            const partner = await adminService.createPartner(email, password, name);
            res.status(201).json(partner);
        } catch (error) {
            console.error('Error creating partner:', error);
            res.status(500).json({ error: 'Error creating partner' });
        }
    }

    async createLocation(req, res) {
        try {
            const { partnerId, name, address } = req.body;
            
            if (!partnerId || !name || !address) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            const location = await adminService.createLocation(partnerId, name, address);
            res.status(201).json(location);
        } catch (error) {
            console.error('Error creating location:', error);
            res.status(500).json({ error: 'Error creating location' });
        }
    }

    async getPartners(req, res) {
        try {
            const partners = await adminService.getPartners();
            res.json(partners);
        } catch (error) {
            console.error('Error getting partners:', error);
            res.status(500).json({ error: 'Error getting partners' });
        }
    }

    async getLocations(req, res) {
        try {
            const locations = await adminService.getLocations();
            res.json(locations);
        } catch (error) {
            console.error('Error getting locations:', error);
            res.status(500).json({ error: 'Error getting locations' });
        }
    }
}

module.exports = new AdminController(); 