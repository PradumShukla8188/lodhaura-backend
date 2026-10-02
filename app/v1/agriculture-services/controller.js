const { AgricultureServiceModel } = require('../../../databaseModels/agricultureService');

module.exports = {
    getAllAgricultureServices: async (req, res) => {
        try {
            const { type, search, admin } = req.query;
            let query = { isDeleted: false, verificationStatus: 'approved' };
            
            if (admin) query = { isDeleted: false };
            if (type && type !== 'All') query.type = type;
            if (search) {
                query.$or = [
                    { providerName: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                ];
            }

            const services = await AgricultureServiceModel.find(query).sort({ createdAt: -1 });
            return res.status(200).send({ success: true, message: 'Agriculture services fetched.', data: services });
        } catch (err) {
            console.log('getAllAgricultureServices err', err);
            return res.status(500).send({ success: false, message: 'Internal server error.' });
        }
    },

    registerAgricultureService: async (req, res) => {
        try {
            const { providerName, type, description, phone, priceRate, address, photos } = req.body;
            let userId = null;
            if (req.user) userId = req.user._id;

            const service = await AgricultureServiceModel.create({
                userId, providerName, type, description, phone, priceRate, address, photos,
                verificationStatus: 'pending'
            });

            return res.status(201).send({ success: true, message: 'Agriculture service registered. Pending admin approval.', data: service });
        } catch (err) {
            return res.status(500).send({ success: false, message: err?.message || 'Error' });
        }
    },

    updateAgricultureServiceStatus: async (req, res) => {
        try {
            const { verificationStatus } = req.body;
            const service = await AgricultureServiceModel.findByIdAndUpdate(req.params.id, { verificationStatus }, { new: true });
            if (!service) return res.status(404).send({ success: false, message: 'Not found' });
            return res.status(200).send({ success: true, message: 'Updated successfully', data: service });
        } catch (err) {
            return res.status(500).send({ success: false, message: err?.message || 'Error' });
        }
    }
};
