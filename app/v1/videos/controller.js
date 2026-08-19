const { VideoModel } = require('../../../databaseModels/video');
const { uploadBuffer, deleteResource } = require('../../../helper/cloudinary');

module.exports = {
    getAllVideos: async (req, res) => {
        try {
            const filter = { isDeleted: false };
            if (req.query.status) filter.status = req.query.status;
            else filter.status = { $in: ['approved', 'active'] };
            const videos = await VideoModel.find(filter)
                .populate('userId', 'name avatar')
                .sort({ createdAt: -1 });
            return res.status(200).send({ message: 'Videos fetched successfully.', data: videos });
        } catch (err) {
            console.log('getAllVideos err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    getVideoById: async (req, res) => {
        try {
            const video = await VideoModel.findById(req.params.id).populate('userId', 'name avatar');
            if (!video) return res.status(404).send({ message: 'Video not found.' });
            return res.status(200).send({ message: 'Video fetched successfully.', data: video });
        } catch (err) {
            console.log('getVideoById err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    uploadVideo: async (req, res) => {
        try {
            if (!req.file) return res.status(400).send({ message: 'Video file is required.' });
            const { title, description } = req.body;
            let url = '';
            let publicId = '';
            let thumbnail = '';
            try {
                const result = await uploadBuffer(req.file.buffer, { resource_type: 'video' });
                url = result.secure_url;
                publicId = result.public_id;
                thumbnail = result.thumbnail_url || '';
            } catch (uploadErr) {
                console.log('Cloudinary upload err', uploadErr?.message);
                return res.status(500).send({ message: 'Failed to upload video.' });
            }
            const video = await VideoModel.create({
                userId: req.user._id,
                title: title || req.file.originalname,
                description: description || '',
                url,
                publicId,
                thumbnail,
            });
            return res.status(201).send({ message: 'Video uploaded successfully.', data: video });
        } catch (err) {
            console.log('uploadVideo err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    deleteVideo: async (req, res) => {
        try {
            const video = await VideoModel.findById(req.params.id);
            if (!video) return res.status(404).send({ message: 'Video not found.' });
            const isOwner = video.userId.toString() === req.user._id.toString();
            const isAdmin = req.user.roleId?.name === 'admin';
            if (!isOwner && !isAdmin) return res.status(403).send({ message: 'Not authorized.' });
            if (video.publicId) await deleteResource(video.publicId, 'video');
            video.isDeleted = true;
            await video.save();
            return res.status(200).send({ message: 'Video deleted successfully.' });
        } catch (err) {
            console.log('deleteVideo err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },
};
