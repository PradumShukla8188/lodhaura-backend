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
            if (!job) return res.status(404).send({ success: false, message: 'Not found or unauthorized' });
            return res.status(200).send({ success: true, message: 'Deleted successfully' });
        } catch (err) {
            return res.status(500).send({ success: false, message: err?.message || 'Error' });
        }
    }
};
