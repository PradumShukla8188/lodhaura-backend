const { WorkerReviewModel } = require('../../../databaseModels/workerReview');
const { WorkerRequestModel } = require('../../../databaseModels/workerRequest');
const { WorkerModel } = require('../../../databaseModels/worker');

module.exports = {
    addReview: async (req, res) => {
        try {
            const userId = req.user._id;
            const { requestId, workerId, rating, review } = req.body;

            const request = await WorkerRequestModel.findById(requestId);
            if (!request) {
                return res.status(404).send({ message: 'Request not found.' });
            }
            if (request.status !== 'Completed') {
                return res.status(400).send({ message: 'Can only review completed jobs.' });
            }
            if (request.userId.toString() !== userId.toString()) {
                return res.status(403).send({ message: 'Not authorized to review this job.' });
            }

            const newReview = await WorkerReviewModel.create({
                requestId, userId, workerId, rating, review
            });

            const worker = await WorkerModel.findById(workerId);
            if (worker) {
                const total = worker.totalReviews || 0;
                const avg = worker.averageRating || 0;
                const newTotal = total + 1;
                const newAvg = ((avg * total) + rating) / newTotal;
                
                worker.totalReviews = newTotal;
                worker.averageRating = newAvg;
                await worker.save();
            }

            return res.status(201).send({ message: 'Review added successfully.', data: newReview });
        } catch (err) {
            if (err.code === 11000) {
                return res.status(400).send({ message: 'You have already reviewed this request.' });
            }
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    getWorkerReviews: async (req, res) => {
        try {
            const { workerId } = req.params;
            const reviews = await WorkerReviewModel.find({ workerId })
                .populate('userId', 'name avatar')
                .sort({ createdAt: -1 });
            return res.status(200).send({ message: 'Reviews fetched successfully.', data: reviews });
        } catch (err) {
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    }
};
