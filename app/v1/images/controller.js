const { ImageModel } = require('../../../databaseModels/image');
const { uploadBuffer, deleteResource } = require('../../../helper/cloudinary');

module.exports = {
    getAllImages: async (req, res) => {
        try {
            const filter = { isDeleted: false, status: 'active' };
            if (req.query.album) filter.album = req.query.album;
            const images = await ImageModel.find(filter)
                .populate('userId', 'name avatar')
                .sort({ createdAt: -1 });
            return res.status(200).send({ message: 'Images fetched successfully.', data: images });
        } catch (err) {
            console.log('getAllImages err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    getImageById: async (req, res) => {
        try {
            const image = await ImageModel.findById(req.params.id).populate('userId', 'name avatar');
            if (!image) return res.status(404).send({ message: 'Image not found.' });
            return res.status(200).send({ message: 'Image fetched successfully.', data: image });
        } catch (err) {
            console.log('getImageById err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    uploadImage: async (req, res) => {
        try {
            if (!req.file) return res.status(400).send({ message: 'Image file is required.' });
            const { caption, album } = req.body;
            let url = '';
            let publicId = '';
            try {
                const result = await uploadBuffer(req.file.buffer, { resource_type: 'image' });
                url = result.secure_url;
                publicId = result.public_id;
            } catch (uploadErr) {
                console.log('Cloudinary upload err', uploadErr?.message);
                return res.status(500).send({ message: 'Failed to upload image.' });
            }
            const image = await ImageModel.create({
                userId: req.user._id,
                url,
                publicId,
                caption: caption || '',
                album: album || 'general',
            });
            return res.status(201).send({ message: 'Image uploaded successfully.', data: image });
        } catch (err) {
            console.log('uploadImage err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    deleteImage: async (req, res) => {
        try {
            const image = await ImageModel.findById(req.params.id);
            if (!image) return res.status(404).send({ message: 'Image not found.' });
            const isOwner = image.userId.toString() === req.user._id.toString();
            const isAdmin = req.user.roleId?.name === 'admin';
            if (!isOwner && !isAdmin) return res.status(403).send({ message: 'Not authorized.' });
            if (image.publicId) await deleteResource(image.publicId);
            image.isDeleted = true;
            await image.save();
            return res.status(200).send({ message: 'Image deleted successfully.' });
        } catch (err) {
            console.log('deleteImage err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },
};
