const { BlogModel } = require('../../../databaseModels/blog');
const { Roles } = require('../../../constants/roles');
const { slugify, estimateReadingTime } = require('../../../helper/slug');

const isOwnerOrAdmin = (user, blog) => {
    const isAdmin = user.roleId && user.roleId.name === Roles.Admin.name;
    const isOwner = blog.userId.toString() === user._id.toString();
    return isAdmin || isOwner;
};

module.exports = {
    createBlog: async (req, res) => {
        try {
            const user = req.user;
            const { title, content, featuredImage, category, tags } = req.body;
            const slug = slugify(title) + '-' + Date.now();
            const existingBlog = await BlogModel.findOne({ slug });
            if (existingBlog) {
                return res.status(400).send({ message: 'Blog with this title already exists.' });
            }
            const blog = await BlogModel.create({
                title,
                slug,
                content,
                featuredImage,
                category,
                tags,
                readingTime: estimateReadingTime(content),
                userId: user._id,
            });
            return res.status(201).send({ message: 'Blog created successfully.', data: blog });
        } catch (err) {
            console.log('createBlog err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    updateBlog: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, content, status, featuredImage, category, tags } = req.body;
            const blog = await BlogModel.findById(id);
            if (!blog) {
                return res.status(404).send({ message: 'Blog not found.' });
            }
            if (!isOwnerOrAdmin(req.user, blog)) {
                return res.status(403).send({ message: 'Not authorized to update this blog.' });
            }
            if (title) {
                blog.title = title;
                blog.slug = slugify(title) + '-' + Date.now();
            }
            if (content) {
                blog.content = content;
                blog.readingTime = estimateReadingTime(content);
            }
            if (featuredImage !== undefined) blog.featuredImage = featuredImage;
            if (category !== undefined) blog.category = category;
            if (tags !== undefined) blog.tags = tags;
            if (status && ['pending', 'approved', 'active', 'inactive'].includes(status)) {
                blog.status = status;
            }
            await blog.save();
            const updated = await BlogModel.findById(id)
                .populate('userId', 'name email avatar')
                .populate('category', 'name slug');
            return res.status(200).send({ message: 'Blog updated successfully.', data: updated });
        } catch (err) {
            console.log('updateBlog err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    deleteBlog: async (req, res) => {
        try {
            const { id } = req.params;
            const blog = await BlogModel.findById(id);
            if (!blog) {
                return res.status(404).send({ message: 'Blog not found.' });
            }
            if (!isOwnerOrAdmin(req.user, blog)) {
                return res.status(403).send({ message: 'Not authorized to delete this blog.' });
            }
            await BlogModel.findByIdAndDelete(id);
            return res.status(200).send({ message: 'Blog deleted successfully.' });
        } catch (err) {
            console.log('deleteBlog err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    getAllBlogs: async (req, res) => {
        try {
            const filter = { isDeleted: false };
            if (req.query.status) filter.status = req.query.status;
            const blogs = await BlogModel.find(filter)
                .populate('userId', 'name email avatar')
                .populate('category', 'name slug')
                .sort({ createdAt: -1 });
            return res.status(200).send({ message: 'Blogs fetched successfully.', data: blogs });
        } catch (err) {
            console.log('getAllBlogs err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    getActiveBlogs: async (req, res) => {
        try {
            const blogs = await BlogModel.find({
                status: { $in: ['approved', 'active'] },
                isDeleted: false,
            })
                .populate('userId', 'name email avatar')
                .populate('category', 'name slug')
                .sort({ createdAt: -1 });
            return res.status(200).send({ message: 'Active blogs fetched successfully.', data: blogs });
        } catch (err) {
            console.log('getActiveBlogs err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    getBlogById: async (req, res) => {
        try {
            const { id } = req.params;
            const blog = await BlogModel.findById(id)
                .populate('userId', 'name email avatar')
                .populate('category', 'name slug');
            if (!blog) {
                return res.status(404).send({ message: 'Blog not found.' });
            }
            return res.status(200).send({ message: 'Blog fetched successfully.', data: blog });
        } catch (err) {
            console.log('getBlogById err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    getAllBlogsByUser: async (req, res) => {
        try {
            const user = req.user;
            const blogs = await BlogModel.find({ userId: user._id, isDeleted: false })
                .populate('category', 'name slug')
                .sort({ createdAt: -1 });
            return res.status(200).send({ message: 'Blogs fetched successfully.', data: blogs });
        } catch (err) {
            console.log('getAllBlogsByUser err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },
};
