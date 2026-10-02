const { WorkerModel } = require('../../../databaseModels/worker');

module.exports = {
    registerWorker: async (req, res) => {
        try {
            const userId = req.user._id;
            const existingWorker = await WorkerModel.findOne({ userId });
            if (existingWorker) {
                return res.status(400).send({ message: 'You are already registered as a worker.' });
            }

            const {
                name, mobileNumber, category, skills, experience, description,
                address, serviceAreaRadius, pricePerDay, pricePerHour, availableDays
            } = req.body;

            const worker = await WorkerModel.create({
                userId, name, mobileNumber, category, skills, experience, description,
                address, serviceAreaRadius, pricePerDay, pricePerHour, availableDays,
                isVerified: true // Auto-verify for simplicity, adjust for admin verification later
            });

            return res.status(201).send({ message: 'Worker registered successfully.', data: worker });
        } catch (err) {
            console.log('registerWorker err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    getMyProfile: async (req, res) => {
        try {
            const worker = await WorkerModel.findOne({ userId: req.user._id });
            if (!worker) {
                return res.status(404).send({ message: 'Worker profile not found.' });
            }
            return res.status(200).send({ message: 'Profile fetched successfully.', data: worker });
        } catch (err) {
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const updateData = req.body;
            delete updateData.isVerified;
            delete updateData.averageRating;
            delete updateData.totalReviews;
            delete updateData.totalJobsCompleted;
            delete updateData.userId;

            const worker = await WorkerModel.findOneAndUpdate(
                { userId: req.user._id },
                { $set: updateData },
                { new: true }
            );

            if (!worker) {
                return res.status(404).send({ message: 'Worker profile not found.' });
            }

            return res.status(200).send({ message: 'Profile updated successfully.', data: worker });
        } catch (err) {
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    getAllWorkers: async (req, res) => {
        try {
            const { category, search, minPrice, maxPrice, status } = req.query;
            let query = { isVerified: true, status: 'active', availabilityStatus: true };
            
            if (status === 'all') {
                query = {};
            }

            if (category && category !== 'All') {
                query.category = category;
            }

            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { skills: { $regex: search, $options: 'i' } },
                    { category: { $regex: search, $options: 'i' } }
                ];
            }

            if (minPrice || maxPrice) {
                query.pricePerDay = {};
                if (minPrice) query.pricePerDay.$gte = Number(minPrice);
                if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
            }

            const workers = await WorkerModel.find(query)
                .populate('userId', 'avatar')
                .sort({ averageRating: -1 });
            return res.status(200).send({ message: 'Workers fetched successfully.', data: workers });
        } catch (err) {
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    getWorkerById: async (req, res) => {
        try {
            const worker = await WorkerModel.findById(req.params.id)
                .populate('userId', 'avatar coverPhoto email');
            if (!worker) {
                return res.status(404).send({ message: 'Worker not found.' });
            }
            return res.status(200).send({ message: 'Worker fetched successfully.', data: worker });
        } catch (err) {
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    }
};
