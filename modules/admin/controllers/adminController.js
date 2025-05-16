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

        if (error.message === 'User with this email already exists') {
            return res.status(409).json({ error: error.message });
        }

        res.status(500).json({ error: 'Error creating partner' });
    }
}


    async updatePartner(req, res) {
    try {
        const { partnerId } = req.params;
        const { email, password, name } = req.body;

        if (!partnerId) {
            return res.status(400).json({ error: 'partnerId is required' });
        }

        if (!email && !password && !name) {
            return res.status(400).json({ error: 'At least one field (email, password, name) must be provided' });
        }

        const updatedPartner = await adminService.updatePartner(partnerId, email, password, name);
        res.status(200).json(updatedPartner);
    } catch (error) {
        console.error('Error updating partner:', error);
        res.status(500).json({ error: 'Error updating partner' });
    }
}

async deletePartner(req, res) {
    try {
        const { partnerId } = req.params;

        if (!partnerId) {
            return res.status(400).json({ error: 'partnerId is required' });
        }

        const result = await adminService.deletePartner(partnerId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting partner:', error);
        res.status(500).json({ error: 'Error deleting partner' });
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

    async updateLocation(req, res) {
        const { locationId } = req.params;
    const { name, address } = req.body;

    try {
        const location = await adminService.updateLocation(locationId, name, address);
        res.json(location);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    }

    async deleteLocation(req, res) {
        const { locationId } = req.params;

    try {
        const result = await adminService.deleteLocation(locationId);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
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