const { EmergencyContactModel } = require('../../../databaseModels/emergencyContact');

module.exports = {
    getAllEmergencyContacts: async (req, res) => {
        try {
            const filter = { isDeleted: false, status: 'active' };
            const contacts = await EmergencyContactModel.find(filter).sort({ category: 1, name: 1 });
            return res.status(200).send({ success: true, message: 'Emergency contacts fetched.', data: contacts });
        } catch (err) {
            console.log('getAllEmergencyContacts err', err);
            return res.status(500).send({ success: false, message: 'Internal server error.' });
        }
    },
    
    getAdminEmergencyContacts: async (req, res) => {
        try {
            const { page = 1, limit = 20, search = '' } = req.query;
            const query = { isDeleted: false };
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { category: { $regex: search, $options: 'i' } },
                    { phone: { $regex: search, $options: 'i' } }
                ];
            }

            const skip = (Number(page) - 1) * Number(limit);
            
            const [contacts, total] = await Promise.all([
                EmergencyContactModel.find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(Number(limit)),
                EmergencyContactModel.countDocuments(query)
            ]);

            return res.status(200).json({ 
                success: true, 
                data: contacts,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    totalRecords: total,
                    totalPages: Math.ceil(total / Number(limit)),
                    hasNextPage: skip + Number(limit) < total,
                    hasPreviousPage: Number(page) > 1
                }
            });
        } catch (err) {
            console.log('getAdminEmergencyContacts err', err);
            return res.status(500).send({ success: false, message: 'Internal server error.' });
        }
    },
    
    // Admin functions
    createEmergencyContact: async (req, res) => {
        try {
            const contact = await EmergencyContactModel.create(req.body);
            return res.status(201).send({ success: true, message: 'Created successfully', data: contact });
        } catch (err) {
            return res.status(500).send({ success: false, message: err?.message || 'Error' });
        }
    },

    updateEmergencyContact: async (req, res) => {
        try {
            const contact = await EmergencyContactModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!contact) return res.status(404).send({ success: false, message: 'Not found' });
            return res.status(200).send({ success: true, message: 'Updated successfully', data: contact });
        } catch (err) {
            return res.status(500).send({ success: false, message: err?.message || 'Error' });
        }
    },

    deleteEmergencyContact: async (req, res) => {
        try {
            const contact = await EmergencyContactModel.findByIdAndUpdate(req.params.id, { isDeleted: true });
            if (!contact) return res.status(404).send({ success: false, message: 'Not found' });
            return res.status(200).send({ success: true, message: 'Deleted successfully' });
        } catch (err) {
            return res.status(500).send({ success: false, message: err?.message || 'Error' });
        }
    }
};
