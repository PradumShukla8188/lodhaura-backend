const { LikeModel } = require('../../../databaseModels/like');
const { BlogModel } = require('../../../databaseModels/blog');
const { NewsModel } = require('../../../databaseModels/news');

const countModels = {
    blog: BlogModel,
    news: NewsModel,
};

module.exports = {
    toggleLike: async (req, res) => {
        try {
            const { targetType, targetId } = req.body;
            const existing = await LikeModel.findOne({
                userId: req.user._id,
                targetType,
                targetId,
            });
            if (existing) {
                await LikeModel.findByIdAndDelete(existing._id);
                if (countModels[targetType]) {
                    await countModels[targetType].findByIdAndUpdate(targetId, { $inc: { likesCount: -1 } });
                }
                return res.status(200).send({ message: 'Like removed.', data: { liked: false } });
            }
            await LikeModel.create({ userId: req.user._id, targetType, targetId });
            if (countModels[targetType]) {
                await countModels[targetType].findByIdAndUpdate(targetId, { $inc: { likesCount: 1 } });
            }
            return res.status(200).send({ message: 'Liked successfully.', data: { liked: true } });
        } catch (err) {
            console.log('toggleLike err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    getMyLikes: async (req, res) => {
        try {
            const likes = await LikeModel.find({ userId: req.user._id }).sort({ createdAt: -1 });
            return res.status(200).send({ message: 'Likes fetched successfully.', data: likes });
        } catch (err) {
            console.log('getMyLikes err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },
};
