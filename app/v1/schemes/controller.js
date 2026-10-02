const { SchemeModel } = require('../../../databaseModels/scheme');
const { slugify } = require('../../../helper/slug');

module.exports = {
    getAllSchemes: async (req, res) => {
        try {
            const filter = { isDeleted: false, status: 'active' };
            const schemes = await SchemeModel.find(filter)
                .populate('category', 'name slug')
                .sort({ createdAt: -1 });
            return res.status(200).send({ message: 'Schemes fetched successfully.', data: schemes });
        } catch (err) {
            console.log('getAllSchemes err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    getSchemeById: async (req, res) => {
        try {
            const scheme = await SchemeModel.findById(req.params.id).populate('category', 'name slug');
            if (!scheme) return res.status(404).send({ message: 'Scheme not found.' });
            return res.status(200).send({ message: 'Scheme fetched successfully.', data: scheme });
        } catch (err) {
            console.log('getSchemeById err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    createScheme: async (req, res) => {
        try {
            const { title, description, eligibility, benefits, applicationProcess, featuredImage, category, department, level, officialWebsite, applicableVillage, responsibleOfficer, startDate, endDate } = req.body;
            const slug = slugify(title) + '-' + Date.now();
            const scheme = await SchemeModel.create({
                title, slug, description, eligibility, benefits, applicationProcess, featuredImage, category, department, level, officialWebsite, applicableVillage, responsibleOfficer, startDate, endDate,
            });
            return res.status(201).send({ message: 'Scheme created successfully.', data: scheme });
        } catch (err) {
            console.log('createScheme err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    updateScheme: async (req, res) => {
        try {
            const scheme = await SchemeModel.findById(req.params.id);
            if (!scheme) return res.status(404).send({ message: 'Scheme not found.' });
            const fields = ['title', 'description', 'eligibility', 'benefits', 'applicationProcess', 'featuredImage', 'category', 'department', 'level', 'officialWebsite', 'applicableVillage', 'responsibleOfficer', 'startDate', 'endDate', 'status'];
            fields.forEach((f) => { if (req.body[f] !== undefined) scheme[f] = req.body[f]; });
            if (req.body.title) scheme.slug = slugify(req.body.title) + '-' + Date.now();
            await scheme.save();
            return res.status(200).send({ message: 'Scheme updated successfully.', data: scheme });
        } catch (err) {
            console.log('updateScheme err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    deleteScheme: async (req, res) => {
        try {
            const scheme = await SchemeModel.findById(req.params.id);
            if (!scheme) return res.status(404).send({ message: 'Scheme not found.' });
            scheme.isDeleted = true;
            await scheme.save();
            return res.status(200).send({ message: 'Scheme deleted successfully.' });
        } catch (err) {
            console.log('deleteScheme err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },
};
