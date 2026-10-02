const { JobModel } = require('../../../databaseModels/job');

module.exports = {
    getAllJobs: async (req, res) => {
        try {
            const { search, status, admin } = req.query;
            let query = { isDeleted: false, status: 'active' };
            
            if (admin) query = { isDeleted: false };
            else if (status) query.status = status;

            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { companyName: { $regex: search, $options: 'i' } },
                    { location: { $regex: search, $options: 'i' } },
                ];
            }

            const jobs = await JobModel.find(query).sort({ createdAt: -1 }).populate('userId', 'name avatar');
            return res.status(200).send({ success: true, message: 'Jobs fetched.', data: jobs });
        } catch (err) {
            console.log('getAllJobs err', err);
            return res.status(500).send({ success: false, message: 'Internal server error.' });
        }
    },

    createJob: async (req, res) => {
        try {
            const job = await JobModel.create({
                ...req.body,
                userId: req.user._id,
                status: 'active'
            });
            return res.status(201).send({ success: true, message: 'Job posted successfully.', data: job });
        } catch (err) {
            return res.status(500).send({ success: false, message: err?.message || 'Error' });
        }
    },

    updateJobStatus: async (req, res) => {
        try {
            const { status } = req.body;
            const job = await JobModel.findOneAndUpdate(
                { _id: req.params.id, userId: req.user._id },
                { status },
                { new: true }
            );
            if (!job) return res.status(404).send({ success: false, message: 'Not found or unauthorized' });
            return res.status(200).send({ success: true, message: 'Status updated', data: job });
        } catch (err) {
            return res.status(500).send({ success: false, message: err?.message || 'Error' });
        }
    },
    
    deleteJob: async (req, res) => {
        try {
            const job = await JobModel.findOneAndUpdate(
                { _id: req.params.id, userId: req.user._id },
                { isDeleted: true }
            );
        } catch (err) {
            return res.status(500).send({ success: false, message: err?.message || 'Error' });
        }
    },

    // Admin functions
    getAdminJobs: async (req, res) => {
        try {
            const { page = 1, limit = 20, search = '' } = req.query;
            const query = { isDeleted: false };
            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }

            const skip = (Number(page) - 1) * Number(limit);
            
            const [jobs, total] = await Promise.all([
                JobModel.find(query)
                    .populate('userId', 'name avatar email')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(Number(limit)),
                JobModel.countDocuments(query)
            ]);

            return res.status(200).json({ 
                success: true, 
                data: jobs,
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

    updateJobStatusAdmin: async (req, res) => {
        try {
            const { status } = req.body;
            const job = await JobModel.findByIdAndUpdate(
                req.params.id, 
                { status },
                { new: true }
            );
            if (!job) return res.status(404).send({ success: false, message: 'Not found' });
            return res.status(200).send({ success: true, message: 'Job status updated', data: job });
        } catch (err) {
            return res.status(500).send({ success: false, message: err?.message || 'Error' });
        }
    },

    deleteJobAdmin: async (req, res) => {
        try {
            const job = await JobModel.findByIdAndUpdate(req.params.id, { isDeleted: true });
            if (!job) return res.status(404).send({ success: false, message: 'Not found' });
            return res.status(200).send({ success: true, message: 'Job deleted successfully' });
        } catch (err) {
            return res.status(500).send({ success: false, message: err?.message || 'Error' });
        }
    }
};
