const { LocalServiceModel } = require('../../../databaseModels/localService');

module.exports = {
    getAllLocalServices: async (req, res) => {
        try {
            const { category, search, admin } = req.query;
            let query = { isDeleted: false, verificationStatus: 'approved' };
            
            if (admin) {
                // Admins can see all non-deleted
                query = { isDeleted: false };
            }

            if (category && category !== 'All') {
                query.category = category;
            }

            if (search) {
                query.$or = [
                    { businessName: { $regex: search, $options: 'i' } },
                    { servicesOffered: { $regex: search, $options: 'i' } },
                    { category: { $regex: search, $options: 'i' } }
                ];
            }

            const services = await LocalServiceModel.find(query).sort({ createdAt: -1 });
            return res.status(200).send({ success: true, message: 'Local services fetched.', data: services });
        } catch (err) {
            console.log('getAllLocalServices err', err);
            return res.status(500).send({ success: false, message: 'Internal server error.' });
        }
    },

    registerLocalService: async (req, res) => {
        try {
            const { businessName, category, description, phone, address, locationLink, openingHours, photos, servicesOffered } = req.body;
            let userId = null;
            if (req.user) userId = req.user._id;

            const service = await LocalServiceModel.create({
                userId, businessName, category, description, phone, address, locationLink, openingHours, photos, servicesOffered,
                verificationStatus: 'pending' // Admin approval required
            });

            return res.status(201).send({ success: true, message: 'Business registered. Pending admin approval.', data: service });
        } catch (err) {
            return res.status(500).send({ success: false, message: err?.message || 'Error' });
        }
    },

    updateLocalServiceStatus: async (req, res) => {
        try {
            const { verificationStatus } = req.body;
            const service = await LocalServiceModel.findByIdAndUpdate(req.params.id, { verificationStatus }, { new: true });
            if (!service) return res.status(404).send({ success: false, message: 'Not found' });
            return res.status(200).send({ success: true, message: 'Updated successfully', data: service });
        } catch (err) {
            return res.status(500).send({ success: false, message: err?.message || 'Error' });
        }
    }
};
