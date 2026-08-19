const { NewsModel } = require('../../../databaseModels/news');
const { slugify } = require('../../../helper/slug');

module.exports = {
    getAllNews: async (req, res) => {
        try {
            const filter = { isDeleted: false };
            if (req.query.status) filter.status = req.query.status;
            else filter.status = { $in: ['approved', 'active'] };
            const news = await NewsModel.find(filter)
                .populate('userId', 'name avatar')
                .populate('category', 'name slug')
                .sort({ createdAt: -1 });
            return res.status(200).send({ message: 'News fetched successfully.', data: news });
        } catch (err) {
            console.log('getAllNews err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    getNewsById: async (req, res) => {
        try {
            const news = await NewsModel.findById(req.params.id)
                .populate('userId', 'name avatar')
                .populate('category', 'name slug');
            if (!news) return res.status(404).send({ message: 'News not found.' });
            return res.status(200).send({ message: 'News fetched successfully.', data: news });
        } catch (err) {
            console.log('getNewsById err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    createNews: async (req, res) => {
        try {
            const { title, content, summary, featuredImage, category, tags } = req.body;
            const slug = slugify(title) + '-' + Date.now();
            const news = await NewsModel.create({
                title,
                slug,
                content,
                summary,
                featuredImage,
                category,
                tags,
                userId: req.user._id,
            });
            return res.status(201).send({ message: 'News created successfully.', data: news });
        } catch (err) {
            console.log('createNews err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    updateNews: async (req, res) => {
        try {
            const news = await NewsModel.findById(req.params.id);
            if (!news) return res.status(404).send({ message: 'News not found.' });
            const fields = ['title', 'content', 'summary', 'featuredImage', 'category', 'tags', 'status'];
            fields.forEach((f) => { if (req.body[f] !== undefined) news[f] = req.body[f]; });
            if (req.body.title) news.slug = slugify(req.body.title) + '-' + Date.now();
            await news.save();
            return res.status(200).send({ message: 'News updated successfully.', data: news });
        } catch (err) {
            console.log('updateNews err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    deleteNews: async (req, res) => {
        try {
            const news = await NewsModel.findById(req.params.id);
            if (!news) return res.status(404).send({ message: 'News not found.' });
            news.isDeleted = true;
            await news.save();
            return res.status(200).send({ message: 'News deleted successfully.' });
        } catch (err) {
            console.log('deleteNews err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },
};
