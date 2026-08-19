const { CommentModel } = require('../../../databaseModels/comment');

module.exports = {
    getComments: async (req, res) => {
        try {
            const { targetType, targetId } = req.query;
            if (!targetType || !targetId) {
                return res.status(400).send({ message: 'targetType and targetId are required.' });
            }
            const comments = await CommentModel.find({
                targetType,
                targetId,
                isDeleted: false,
                parentId: null,
            })
                .populate('userId', 'name avatar')
                .sort({ createdAt: -1 });
            return res.status(200).send({ message: 'Comments fetched successfully.', data: comments });
        } catch (err) {
            console.log('getComments err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    createComment: async (req, res) => {
        try {
            const { targetType, targetId, content, parentId } = req.body;
            const comment = await CommentModel.create({
                userId: req.user._id,
                targetType,
                targetId,
                content,
                parentId: parentId || null,
            });
            const populated = await CommentModel.findById(comment._id).populate('userId', 'name avatar');
            return res.status(201).send({ message: 'Comment created successfully.', data: populated });
        } catch (err) {
            console.log('createComment err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    deleteComment: async (req, res) => {
        try {
            const comment = await CommentModel.findById(req.params.id);
            if (!comment) return res.status(404).send({ message: 'Comment not found.' });
            const isOwner = comment.userId.toString() === req.user._id.toString();
            const isAdmin = req.user.roleId?.name === 'admin';
            if (!isOwner && !isAdmin) return res.status(403).send({ message: 'Not authorized.' });
            comment.isDeleted = true;
            await comment.save();
            return res.status(200).send({ message: 'Comment deleted successfully.' });
        } catch (err) {
            console.log('deleteComment err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },
};
