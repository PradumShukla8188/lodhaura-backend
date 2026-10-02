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
    },

    // Admin functions
    getAdminWorkers: async (req, res) => {
        try {
            const { page = 1, limit = 20, search = '' } = req.query;
            const query = { isDeleted: false };
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { skills: { $regex: search, $options: 'i' } },
                    { category: { $regex: search, $options: 'i' } }
                ];
            }

            const skip = (Number(page) - 1) * Number(limit);
            
            const [workers, total] = await Promise.all([
                WorkerModel.find(query)
                    .populate('userId', 'avatar name email')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(Number(limit)),
                WorkerModel.countDocuments(query)
            ]);

            return res.status(200).json({ 
                success: true, 
                data: workers,
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

    verifyWorker: async (req, res) => {
        try {
            const { isVerified } = req.body;
            const worker = await WorkerModel.findByIdAndUpdate(
                req.params.id, 
                { isVerified },
                { new: true }
            );
            if (!worker) return res.status(404).send({ success: false, message: 'Not found' });
            return res.status(200).send({ success: true, message: 'Worker verification updated', data: worker });
        } catch (err) {
            return res.status(500).send({ success: false, message: err?.message || 'Error' });
        }
    },

    deleteWorker: async (req, res) => {
        try {
            const worker = await WorkerModel.findByIdAndUpdate(req.params.id, { isDeleted: true });
            if (!worker) return res.status(404).send({ success: false, message: 'Not found' });
            return res.status(200).send({ success: true, message: 'Worker deleted successfully' });
        } catch (err) {
            return res.status(500).send({ success: false, message: err?.message || 'Error' });
        }
    }
};
