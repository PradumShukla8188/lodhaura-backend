const { UserModel } = require('../../../databaseModels/users');
const { BlogModel } = require('../../../databaseModels/blog');
const { NewsModel } = require('../../../databaseModels/news');
const { EventModel } = require('../../../databaseModels/event');
const { ImageModel } = require('../../../databaseModels/image');
const { VideoModel } = require('../../../databaseModels/video');
const { ReportModel } = require('../../../databaseModels/report');
const { DonationModel } = require('../../../databaseModels/donation');
const { ContactModel } = require('../../../databaseModels/contact');
const { LocalServiceModel } = require('../../../databaseModels/localService');
const { AgricultureServiceModel } = require('../../../databaseModels/agricultureService');

module.exports = {
    getDashboardStats: async (req, res) => {
        try {
            const [users, blogs, news, events, reports, donations, contacts] = await Promise.all([
                UserModel.countDocuments({ isDeleted: false }),
                BlogModel.countDocuments({ isDeleted: false }),
                NewsModel.countDocuments({ isDeleted: false }),
                EventModel.countDocuments({ isDeleted: false }),
                ReportModel.countDocuments({ status: 'pending' }),
                DonationModel.countDocuments({ isDeleted: false }),
                ContactModel.countDocuments({ status: 'new' }),
            ]);
            return res.status(200).send({
                message: 'Dashboard stats fetched successfully.',
                data: { users, blogs, news, events, pendingReports: reports, donations, newContacts: contacts },
            });
        } catch (err) {
            console.log('getDashboardStats err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    getPendingContent: async (req, res) => {
        try {
            const [blogs, news, events, localServices, agricultureServices] = await Promise.all([
                BlogModel.find({ status: 'pending', isDeleted: false }).populate('userId', 'name email'),
                NewsModel.find({ status: 'pending', isDeleted: false }).populate('userId', 'name email'),
                EventModel.find({ status: 'pending', isDeleted: false }).populate('userId', 'name email'),
                LocalServiceModel.find({ verificationStatus: 'pending', isDeleted: false }).populate('userId', 'name email'),
                AgricultureServiceModel.find({ verificationStatus: 'pending', isDeleted: false }).populate('userId', 'name email'),
            ]);
            return res.status(200).send({
                message: 'Pending content fetched successfully.',
                data: { blogs, news, events, localServices, agricultureServices },
            });
        } catch (err) {
            console.log('getPendingContent err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    approveContent: async (req, res) => {
        try {
            const { type, id } = req.params;
            const models = { blog: BlogModel, news: NewsModel, event: EventModel, image: ImageModel, video: VideoModel, localService: LocalServiceModel, agricultureService: AgricultureServiceModel };
            const Model = models[type];
            if (!Model) return res.status(400).send({ message: 'Invalid content type.' });
            const doc = await Model.findById(id);
            if (!doc) return res.status(404).send({ message: 'Content not found.' });
            
            if (type === 'localService' || type === 'agricultureService') {
                doc.verificationStatus = 'approved';
            } else {
                doc.status = 'approved';
            }
            
            await doc.save();
            return res.status(200).send({ message: 'Content approved successfully.', data: doc });
        } catch (err) {
            console.log('approveContent err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    updateContentStatus: async (req, res) => {
        try {
            const { type, id } = req.params;
            const { status } = req.body;
            const allowed = ['pending', 'approved', 'inactive', 'active', 'rejected'];
            if (!allowed.includes(status)) {
                return res.status(400).send({ message: 'Invalid status value.' });
            }
            const models = { blog: BlogModel, news: NewsModel, event: EventModel, image: ImageModel, video: VideoModel, localService: LocalServiceModel, agricultureService: AgricultureServiceModel };
            const Model = models[type];
            if (!Model) return res.status(400).send({ message: 'Invalid content type.' });
            const doc = await Model.findById(id);
            if (!doc) return res.status(404).send({ message: 'Content not found.' });
            
            if (type === 'localService' || type === 'agricultureService') {
                doc.verificationStatus = status;
            } else {
                doc.status = status;
            }
            
            await doc.save();
            return res.status(200).send({ message: 'Content status updated.', data: doc });
        } catch (err) {
            console.log('updateContentStatus err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    getAllUsersAdmin: async (req, res) => {
        try {
            const { page = 1, limit = 20, search = '' } = req.query;
            const query = { isDeleted: false };
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { phone: { $regex: search, $options: 'i' } }
                ];
            }

            const skip = (Number(page) - 1) * Number(limit);
            
            const [users, total] = await Promise.all([
                UserModel.find(query)
                    .select('-password -refreshToken -resetPasswordToken')
                    .populate('roleId', 'name displayValue')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(Number(limit)),
                UserModel.countDocuments(query)
            ]);

            return res.status(200).send({ 
                message: 'Users fetched successfully.', 
                data: users,
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
            console.log('getAllUsersAdmin err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    toggleUserStatus: async (req, res) => {
        try {
            const user = await UserModel.findById(req.params.id);
            if (!user) return res.status(404).send({ message: 'User not found.' });
            if (user._id.toString() === req.user._id.toString()) {
                return res.status(400).send({ message: 'Cannot change your own status.' });
            }
            user.status = user.status === 'active' ? 'inactive' : 'active';
            await user.save();
            const updated = await UserModel.findById(user._id)
                .select('-password -refreshToken -resetPasswordToken')
                .populate('roleId', 'name displayValue');
            return res.status(200).send({ message: 'User status updated.', data: updated });
        } catch (err) {
            console.log('toggleUserStatus err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    getAllContent: async (req, res) => {
        try {
            const [blogs, images, videos] = await Promise.all([
                BlogModel.find({ isDeleted: false }).populate('userId', 'name email').sort({ createdAt: -1 }),
                ImageModel.find({ isDeleted: false }).populate('userId', 'name email').sort({ createdAt: -1 }),
                VideoModel.find({ isDeleted: false }).populate('userId', 'name email').sort({ createdAt: -1 }),
            ]);
            return res.status(200).send({ message: 'Content fetched successfully.', data: { blogs, images, videos } });
        } catch (err) {
            console.log('getAllContent err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    getReports: async (req, res) => {
        try {
            const filter = {};
            if (req.query.status) filter.status = req.query.status;
            const reports = await ReportModel.find(filter)
                .populate('reporterId', 'name email')
                .sort({ createdAt: -1 });
            return res.status(200).send({ message: 'Reports fetched successfully.', data: reports });
        } catch (err) {
            console.log('getReports err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    updateReportStatus: async (req, res) => {
        try {
            const report = await ReportModel.findById(req.params.id);
            if (!report) return res.status(404).send({ message: 'Report not found.' });
            if (req.body.status) report.status = req.body.status;
            await report.save();
            return res.status(200).send({ message: 'Report updated successfully.', data: report });
        } catch (err) {
            console.log('updateReportStatus err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    submitReport: async (req, res) => {
        try {
            const { targetType, targetId, reason, description } = req.body;
            const report = await ReportModel.create({
                reporterId: req.user._id,
                targetType,
                targetId,
                reason,
                description,
            });
            return res.status(201).send({ message: 'Report submitted successfully.', data: report });
        } catch (err) {
            console.log('submitReport err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },
};
