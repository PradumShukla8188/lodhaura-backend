const { DocumentModel } = require('../../../databaseModels/document');

module.exports = {
    getDocuments: async (req, res) => {
        try {
            const docs = await DocumentModel.find({ isDeleted: false })
                .populate('uploadedBy', 'name email')
                .populate('relatedProject', 'name')
                .populate('relatedScheme', 'title')
                .sort({ createdAt: -1 });
            return res.status(200).send({ success: true, data: docs });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    },

    createDocument: async (req, res) => {
        try {
            const docData = { ...req.body, uploadedBy: req.user._id };
            const doc = await DocumentModel.create(docData);
            return res.status(201).send({ success: true, data: doc, message: 'Document uploaded successfully.' });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    },

    updateDocument: async (req, res) => {
        try {
            const doc = await DocumentModel.findOneAndUpdate(
                { _id: req.params.id, isDeleted: false },
                { $set: req.body },
                { new: true }
            );
            if (!doc) return res.status(404).send({ success: false, message: 'Document not found.' });
            return res.status(200).send({ success: true, data: doc, message: 'Document updated successfully.' });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    },

    deleteDocument: async (req, res) => {
        try {
            const doc = await DocumentModel.findOneAndUpdate(
                { _id: req.params.id, isDeleted: false },
                { $set: { isDeleted: true } },
                { new: true }
            );
            if (!doc) return res.status(404).send({ success: false, message: 'Document not found.' });
            return res.status(200).send({ success: true, message: 'Document deleted successfully.' });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    }
};
