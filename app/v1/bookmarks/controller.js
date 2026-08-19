const { BookmarkModel } = require('../../../databaseModels/bookmark');

module.exports = {
    toggleBookmark: async (req, res) => {
        try {
            const { targetType, targetId } = req.body;
            const existing = await BookmarkModel.findOne({
                userId: req.user._id,
                targetType,
                targetId,
            });
            if (existing) {
                await BookmarkModel.findByIdAndDelete(existing._id);
                return res.status(200).send({ message: 'Bookmark removed.', data: { bookmarked: false } });
            }
            const bookmark = await BookmarkModel.create({ userId: req.user._id, targetType, targetId });
            return res.status(200).send({ message: 'Bookmarked successfully.', data: { bookmarked: true, bookmark } });
        } catch (err) {
            console.log('toggleBookmark err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    getMyBookmarks: async (req, res) => {
        try {
            const bookmarks = await BookmarkModel.find({ userId: req.user._id }).sort({ createdAt: -1 });
            return res.status(200).send({ message: 'Bookmarks fetched successfully.', data: bookmarks });
        } catch (err) {
            console.log('getMyBookmarks err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },
};
