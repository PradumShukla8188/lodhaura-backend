const { WorkerRequestModel } = require('../../../databaseModels/workerRequest');
const { WorkerModel } = require('../../../databaseModels/worker');

module.exports = {
    createRequest: async (req, res) => {
        try {
            const userId = req.user._id;
            const { workerId, service, requiredDate, numberOfDays, notes, estimatedTotal } = req.body;

            const request = await WorkerRequestModel.create({
                userId, workerId, service, requiredDate, numberOfDays, notes, estimatedTotal
            });

            return res.status(201).send({ message: 'Worker request sent successfully.', data: request });
        } catch (err) {
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    getMyRequests: async (req, res) => {
        try {
            const requests = await WorkerRequestModel.find({ userId: req.user._id })
                .populate('workerId')
                .sort({ createdAt: -1 });
            return res.status(200).send({ message: 'Requests fetched successfully.', data: requests });
        } catch (err) {
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    getMyJobs: async (req, res) => {
        try {
            const worker = await WorkerModel.findOne({ userId: req.user._id });
            if (!worker) {
                return res.status(404).send({ message: 'Worker profile not found.' });
            }

            const jobs = await WorkerRequestModel.find({ workerId: worker._id })
                .populate('userId', 'name email phone avatar')
                .sort({ createdAt: -1 });
            return res.status(200).send({ message: 'Jobs fetched successfully.', data: jobs });
        } catch (err) {
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    updateRequestStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            
            const request = await WorkerRequestModel.findById(id);
            if (!request) {
                return res.status(404).send({ message: 'Request not found.' });
            }

            const worker = await WorkerModel.findOne({ userId: req.user._id });
            const isWorkerOwner = worker && request.workerId.toString() === worker._id.toString();
            const isUserOwner = request.userId.toString() === req.user._id.toString();

            if (!isWorkerOwner && !isUserOwner) {
                return res.status(403).send({ message: 'Unauthorized to update this request.' });
            }

            if (status === 'Completed' && request.status !== 'Completed') {
                await WorkerModel.findByIdAndUpdate(request.workerId, {
                    $inc: { totalJobsCompleted: 1 }
                });
            }

            request.status = status;
            await request.save();

            return res.status(200).send({ message: `Request status updated to ${status}.`, data: request });
        } catch (err) {
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    }
};
