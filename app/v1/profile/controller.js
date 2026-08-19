const { UserModel } = require('../../../databaseModels/users');
const { BlogModel } = require('../../../databaseModels/blog');
const { ImageModel } = require('../../../databaseModels/image');
const { VideoModel } = require('../../../databaseModels/video');
const { hashPassword, comparePassword } = require('../../../helper/bcrypt');

const sanitizeUser = (user) => {
    const obj = user.toObject ? user.toObject() : { ...user };
    delete obj.password;
    delete obj.refreshToken;
    delete obj.resetPasswordToken;
    if (obj.roleId?.name) obj.roleName = obj.roleId.name;
    return obj;
};

module.exports = {
    getMyProfile: async (req, res) => {
        try {
            const userId = req.user._id;
            const [user, blogsCount, imagesCount, videosCount, blogs, images, videos] = await Promise.all([
                UserModel.findById(userId).select('-password -refreshToken -resetPasswordToken').populate('roleId'),
                BlogModel.countDocuments({ userId, isDeleted: false }),
                ImageModel.countDocuments({ userId, isDeleted: false }),
                VideoModel.countDocuments({ userId, isDeleted: false }),
                BlogModel.find({ userId, isDeleted: false }).sort({ createdAt: -1 }).limit(10),
                ImageModel.find({ userId, isDeleted: false }).sort({ createdAt: -1 }).limit(12),
                VideoModel.find({ userId, isDeleted: false }).sort({ createdAt: -1 }).limit(10),
            ]);

            return res.status(200).send({
                message: 'Profile fetched successfully.',
                data: {
                    user: sanitizeUser(user),
                    stats: { blogs: blogsCount, images: imagesCount, videos: videosCount },
                    blogs,
                    images,
                    videos,
                },
            });
        } catch (err) {
            console.log('getMyProfile err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    updateMyProfile: async (req, res) => {
        try {
            const { name, phone, bio, avatar, coverPhoto, themePreference } = req.body;
            const user = await UserModel.findById(req.user._id);
            if (!user) return res.status(404).send({ message: 'User not found.' });

            if (name) user.name = name;
            if (phone !== undefined) user.phone = phone;
            if (bio !== undefined) user.bio = bio;
            if (avatar !== undefined) user.avatar = avatar;
            if (coverPhoto !== undefined) user.coverPhoto = coverPhoto;
            if (themePreference) user.themePreference = themePreference;

            await user.save();
            const updated = await UserModel.findById(user._id)
                .select('-password -refreshToken -resetPasswordToken')
                .populate('roleId');

            return res.status(200).send({
                message: 'Profile updated successfully.',
                data: sanitizeUser(updated),
            });
        } catch (err) {
            console.log('updateMyProfile err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    changePassword: async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            const user = await UserModel.findById(req.user._id);
            if (!user) return res.status(404).send({ message: 'User not found.' });

            const valid = await comparePassword(currentPassword, user.password);
            if (!valid) {
                return res.status(400).send({ message: 'Current password is incorrect.' });
            }

            user.password = await hashPassword(newPassword);
            user.refreshToken = '';
            await user.save();

            return res.status(200).send({ message: 'Password changed successfully.' });
        } catch (err) {
            console.log('changePassword err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },
};
