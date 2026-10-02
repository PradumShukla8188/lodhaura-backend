const { ProjectModel } = require('../../../databaseModels/project');
const { ProjectProgressModel } = require('../../../databaseModels/projectProgress');

module.exports = {
    getProjects: async (req, res) => {
        try {
            const projects = await ProjectModel.find({ isDeleted: false })
                .populate('department', 'name')
                .populate('scheme', 'title')
                .populate('assignedOfficer', 'name email')
                .sort({ createdAt: -1 });
            return res.status(200).send({ success: true, data: projects });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    },

    getProjectById: async (req, res) => {
        try {
            const project = await ProjectModel.findOne({ _id: req.params.id, isDeleted: false })
                .populate('department', 'name')
                .populate('scheme', 'title')
                .populate('assignedOfficer', 'name email');
            if (!project) return res.status(404).send({ success: false, message: 'Project not found.' });
            return res.status(200).send({ success: true, data: project });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    },

    createProject: async (req, res) => {
        try {
            const project = await ProjectModel.create(req.body);
            return res.status(201).send({ success: true, data: project, message: 'Project created successfully.' });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    },

    updateProject: async (req, res) => {
        try {
            const project = await ProjectModel.findOneAndUpdate(
                { _id: req.params.id, isDeleted: false },
                { $set: req.body },
                { new: true }
            );
            if (!project) return res.status(404).send({ success: false, message: 'Project not found.' });
            return res.status(200).send({ success: true, data: project, message: 'Project updated successfully.' });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    },

    deleteProject: async (req, res) => {
        try {
            const project = await ProjectModel.findOneAndUpdate(
                { _id: req.params.id, isDeleted: false },
                { $set: { isDeleted: true } },
                { new: true }
            );
            if (!project) return res.status(404).send({ success: false, message: 'Project not found.' });
            return res.status(200).send({ success: true, message: 'Project deleted successfully.' });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    },

    // Progress
    getProjectProgress: async (req, res) => {
        try {
            const progress = await ProjectProgressModel.find({ project: req.params.id })
                .populate('updatedBy', 'name designation')
                .sort({ date: -1 });
            return res.status(200).send({ success: true, data: progress });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    },

    addProjectProgress: async (req, res) => {
        try {
            const project = await ProjectModel.findById(req.params.id);
            if (!project || project.isDeleted) {
                return res.status(404).send({ success: false, message: 'Project not found.' });
            }

            const { progressPercentage, description, workCompleted, workRemaining, photos, documents } = req.body;

            const progress = await ProjectProgressModel.create({
                project: req.params.id,
                progressPercentage,
                description,
                workCompleted,
                workRemaining,
                photos: photos || [],
                documents: documents || [],
                updatedBy: req.user._id
            });

            // Auto update project overall progress
            project.progressPercentage = progressPercentage;
            if (progressPercentage === 100) project.status = 'Completed';
            await project.save();

            return res.status(201).send({ success: true, data: progress, message: 'Progress added successfully.' });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    }
};
