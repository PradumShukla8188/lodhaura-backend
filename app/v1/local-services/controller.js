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

    // Admin functions
    getAdminLocalServices: async (req, res) => {
        try {
            const { page = 1, limit = 20, search = '' } = req.query;
            const query = { isDeleted: false };
            if (search) {
                query.$or = [
                    { businessName: { $regex: search, $options: 'i' } },
                    { servicesOffered: { $regex: search, $options: 'i' } },
                    { category: { $regex: search, $options: 'i' } }
                ];
            }

            const skip = (Number(page) - 1) * Number(limit);
            
            const [services, total] = await Promise.all([
                LocalServiceModel.find(query)
                    .populate('userId', 'name avatar email')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(Number(limit)),
                LocalServiceModel.countDocuments(query)
            ]);

            return res.status(200).json({ 
                success: true, 
                data: services,
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
            return res.status(500).send({ success: false, message: 'Internal server error.' });
        }
    },

    updateLocalServiceStatusAdmin: async (req, res) => {
        try {
            const { verificationStatus } = req.body;
            const service = await LocalServiceModel.findByIdAndUpdate(req.params.id, { verificationStatus }, { new: true });
            if (!service) return res.status(404).send({ success: false, message: 'Not found' });
            return res.status(200).send({ success: true, message: 'Updated successfully', data: service });
        } catch (err) {
            return res.status(500).send({ success: false, message: err?.message || 'Error' });
        }
    },

    deleteLocalServiceAdmin: async (req, res) => {
        try {
            const service = await LocalServiceModel.findByIdAndUpdate(req.params.id, { isDeleted: true });
            if (!service) return res.status(404).send({ success: false, message: 'Not found' });
            return res.status(200).send({ success: true, message: 'Service deleted successfully' });
        } catch (err) {
            return res.status(500).send({ success: false, message: err?.message || 'Error' });
        }
    }
};
