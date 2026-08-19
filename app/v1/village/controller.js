const { VillageInfoModel } = require('../../../databaseModels/villageInfo');
const { TempleModel } = require('../../../databaseModels/temple');
const { SchoolModel } = require('../../../databaseModels/school');
const { ServiceModel } = require('../../../databaseModels/service');

module.exports = {
    getVillageInfo: async (req, res) => {
        try {
            const info = await VillageInfoModel.findOne({ isActive: true });
            return res.status(200).send({ message: 'Village info fetched successfully.', data: info });
        } catch (err) {
            console.log('getVillageInfo err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    updateVillageInfo: async (req, res) => {
        try {
            let info = await VillageInfoModel.findOne({ isActive: true });
            if (!info) {
                info = await VillageInfoModel.create(req.body);
            } else {
                Object.assign(info, req.body);
                await info.save();
            }
            return res.status(200).send({ message: 'Village info updated successfully.', data: info });
        } catch (err) {
            console.log('updateVillageInfo err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    getTemples: async (req, res) => {
        try {
            const temples = await TempleModel.find({ isDeleted: false, status: 'active' }).sort({ name: 1 });
            return res.status(200).send({ message: 'Temples fetched successfully.', data: temples });
        } catch (err) {
            console.log('getTemples err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    createTemple: async (req, res) => {
        try {
            const temple = await TempleModel.create(req.body);
            return res.status(201).send({ message: 'Temple created successfully.', data: temple });
        } catch (err) {
            console.log('createTemple err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    getSchools: async (req, res) => {
        try {
            const schools = await SchoolModel.find({ isDeleted: false, status: 'active' }).sort({ name: 1 });
            return res.status(200).send({ message: 'Schools fetched successfully.', data: schools });
        } catch (err) {
            console.log('getSchools err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    createSchool: async (req, res) => {
        try {
            const school = await SchoolModel.create(req.body);
            return res.status(201).send({ message: 'School created successfully.', data: school });
        } catch (err) {
            console.log('createSchool err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    getServices: async (req, res) => {
        try {
            const services = await ServiceModel.find({ isDeleted: false, status: 'active' })
                .populate('category', 'name slug')
                .sort({ name: 1 });
            return res.status(200).send({ message: 'Services fetched successfully.', data: services });
        } catch (err) {
            console.log('getServices err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    createService: async (req, res) => {
        try {
            const service = await ServiceModel.create(req.body);
            return res.status(201).send({ message: 'Service created successfully.', data: service });
        } catch (err) {
            console.log('createService err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },
};
