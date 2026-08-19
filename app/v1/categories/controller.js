const { CategoryModel } = require('../../../databaseModels/category');
const { slugify } = require('../../../helper/slug');

module.exports = {
    getAllCategories: async (req, res) => {
        try {
            const filter = { isDeleted: false };
            if (req.query.type) filter.type = req.query.type;
            const categories = await CategoryModel.find(filter).sort({ name: 1 });
            return res.status(200).send({ message: 'Categories fetched successfully.', data: categories });
        } catch (err) {
            console.log('getAllCategories err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    getCategoryById: async (req, res) => {
        try {
            const category = await CategoryModel.findById(req.params.id);
            if (!category) return res.status(404).send({ message: 'Category not found.' });
            return res.status(200).send({ message: 'Category fetched successfully.', data: category });
        } catch (err) {
            console.log('getCategoryById err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    createCategory: async (req, res) => {
        try {
            const { name, type, description, icon } = req.body;
            const slug = slugify(name);
            const existing = await CategoryModel.findOne({ slug });
            if (existing) return res.status(400).send({ message: 'Category with this name already exists.' });
            const category = await CategoryModel.create({ name, slug, type, description, icon });
            return res.status(201).send({ message: 'Category created successfully.', data: category });
        } catch (err) {
            console.log('createCategory err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    updateCategory: async (req, res) => {
        try {
            const category = await CategoryModel.findById(req.params.id);
            if (!category) return res.status(404).send({ message: 'Category not found.' });
            const { name, type, description, icon, status } = req.body;
            if (name) {
                category.name = name;
                category.slug = slugify(name);
            }
            if (type) category.type = type;
            if (description !== undefined) category.description = description;
            if (icon !== undefined) category.icon = icon;
            if (status) category.status = status;
            await category.save();
            return res.status(200).send({ message: 'Category updated successfully.', data: category });
        } catch (err) {
            console.log('updateCategory err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const category = await CategoryModel.findById(req.params.id);
            if (!category) return res.status(404).send({ message: 'Category not found.' });
            category.isDeleted = true;
            await category.save();
            return res.status(200).send({ message: 'Category deleted successfully.' });
        } catch (err) {
            console.log('deleteCategory err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },
};
