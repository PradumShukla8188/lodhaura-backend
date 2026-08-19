const { BlogModel } = require('../../../databaseModels/blog');
const { NewsModel } = require('../../../databaseModels/news');
const { EventModel } = require('../../../databaseModels/event');
const { UserModel } = require('../../../databaseModels/users');
const { SchemeModel } = require('../../../databaseModels/scheme');

module.exports = {
    search: async (req, res) => {
        try {
            const q = (req.query.q || '').trim();
            if (!q) {
                return res.status(400).send({ message: 'Search query is required.' });
            }
            const regex = new RegExp(q, 'i');
            const limit = parseInt(req.query.limit || global.pagination_limit || 10, 10);

            const [blogs, news, events, users, schemes] = await Promise.all([
                BlogModel.find({ isDeleted: false, status: { $in: ['approved', 'active'] }, $or: [{ title: regex }, { content: regex }, { tags: regex }] })
                    .select('title slug featuredImage status createdAt')
                    .limit(limit),
                NewsModel.find({ isDeleted: false, status: { $in: ['approved', 'active'] }, $or: [{ title: regex }, { content: regex }, { tags: regex }] })
                    .select('title slug featuredImage status createdAt')
                    .limit(limit),
                EventModel.find({ isDeleted: false, status: { $in: ['approved', 'active'] }, $or: [{ title: regex }, { description: regex }, { location: regex }] })
                    .select('title slug featuredImage startDate location')
                    .limit(limit),
                UserModel.find({ isDeleted: false, $or: [{ name: regex }, { email: regex }] })
                    .select('name email avatar bio')
                    .limit(limit),
                SchemeModel.find({ isDeleted: false, status: 'active', $or: [{ title: regex }, { description: regex }] })
                    .select('title slug featuredImage status')
                    .limit(limit),
            ]);

            return res.status(200).send({
                message: 'Search results fetched successfully.',
                data: { blogs, news, events, users, schemes, query: q },
            });
        } catch (err) {
            console.log('search err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },
};
