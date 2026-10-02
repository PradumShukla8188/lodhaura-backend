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
