const { ResidentProfileModel } = require('../../../databaseModels/residentProfile');
const { FamilyMemberModel } = require('../../../databaseModels/familyMember');
const { ResidentDocumentModel } = require('../../../databaseModels/residentDocument');
const { DocumentTemplateModel } = require('../../../databaseModels/documentTemplate');

module.exports = {
    getProfile: async (req, res) => {
        try {
            const profile = await ResidentProfileModel.findOne({ userId: req.user._id });
            if (!profile) return res.status(404).send({ message: 'Resident profile not found' });
            return res.status(200).send({ data: profile });
        } catch (err) {
            return res.status(500).send({ message: err.message });
        }
    },
    
    updateProfile: async (req, res) => {
        try {
            const profile = await ResidentProfileModel.findOneAndUpdate(
                { userId: req.user._id },
                { $set: req.body },
                { new: true }
            );
            return res.status(200).send({ message: 'Profile updated', data: profile });
        } catch (err) {
            return res.status(500).send({ message: err.message });
        }
    },

    getFamilyMembers: async (req, res) => {
        try {
            const profile = await ResidentProfileModel.findOne({ userId: req.user._id });
            if (!profile) return res.status(404).send({ message: 'Resident profile not found' });
            const members = await FamilyMemberModel.find({ residentProfileId: profile._id, isDeleted: false });
            return res.status(200).send({ data: members });
        } catch (err) {
            return res.status(500).send({ message: err.message });
        }
    },

    addFamilyMember: async (req, res) => {
        try {
            const profile = await ResidentProfileModel.findOne({ userId: req.user._id });
            if (!profile) return res.status(404).send({ message: 'Resident profile not found' });
            const member = await FamilyMemberModel.create({ ...req.body, residentProfileId: profile._id });
            return res.status(201).send({ message: 'Family member added', data: member });
        } catch (err) {
            return res.status(500).send({ message: err.message });
        }
    },

    getDocuments: async (req, res) => {
        try {
            const profile = await ResidentProfileModel.findOne({ userId: req.user._id });
            if (!profile) return res.status(404).send({ message: 'Resident profile not found' });
            
            // Get all active templates
            const templates = await DocumentTemplateModel.find({ isDeleted: false, status: 'active' }).populate('categoryId');
            
            // Get resident's specific statuses
            const statuses = await ResidentDocumentModel.find({ residentProfileId: profile._id });
            
            // Merge them
            const data = templates.map(t => {
                const statusObj = statuses.find(s => s.documentTemplateId.toString() === t._id.toString());
                return {
                    template: t,
                    status: statusObj ? statusObj.status : 'Pending',
                    uploadedFileUrl: statusObj ? statusObj.uploadedFileUrl : null,
                    residentDocumentId: statusObj ? statusObj._id : null
                };
            });
            
            return res.status(200).send({ data });
        } catch (err) {
            return res.status(500).send({ message: err.message });
        }
    },

    updateDocumentStatus: async (req, res) => {
        try {
            const profile = await ResidentProfileModel.findOne({ userId: req.user._id });
            if (!profile) return res.status(404).send({ message: 'Resident profile not found' });
            
            const { templateId, status, uploadedFileUrl } = req.body;
            
            const doc = await ResidentDocumentModel.findOneAndUpdate(
                { residentProfileId: profile._id, documentTemplateId: templateId },
                { $set: { status, uploadedFileUrl } },
                { new: true, upsert: true }
            );
            
            return res.status(200).send({ message: 'Document status updated', data: doc });
        } catch (err) {
            return res.status(500).send({ message: err.message });
        }
    },

    // Admin functions
    getAdminResidents: async (req, res) => {
        try {
            const { page = 1, limit = 20, search = '' } = req.query;
            const query = { isDeleted: false };
            
            // Search might require looking up the user collection first, or we can just search ResidentProfile fields
            // But we can populate user first.
            if (search) {
                query.$or = [
                    { houseNumber: { $regex: search, $options: 'i' } },
                    { familyHeadName: { $regex: search, $options: 'i' } }
                ];
            }

            const skip = (Number(page) - 1) * Number(limit);
            
            const [profiles, total] = await Promise.all([
                ResidentProfileModel.find(query)
                    .populate('userId', 'name phone email avatar roleId')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(Number(limit)),
                ResidentProfileModel.countDocuments(query)
            ]);

            return res.status(200).json({ 
                success: true, 
                data: profiles,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    totalRecords: total,
                    totalPages: Math.ceil(total / Number(limit)),
                    hasNextPage: skip + Number(limit) < total,
                    hasPreviousPage: Number(page) > 1
                }
            });
        } catch (err) {
            return res.status(500).send({ success: false, message: 'Internal server error.' });
        }
    },

    deleteResidentAdmin: async (req, res) => {
        try {
            const profile = await ResidentProfileModel.findByIdAndUpdate(req.params.id, { isDeleted: true });
            if (!profile) return res.status(404).send({ success: false, message: 'Not found' });
            return res.status(200).send({ success: true, message: 'Resident deleted successfully' });
        } catch (err) {
            return res.status(500).send({ success: false, message: err?.message || 'Error' });
        }
    }
};
