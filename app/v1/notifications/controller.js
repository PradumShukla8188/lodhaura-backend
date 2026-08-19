const { NotificationModel } = require('../../../databaseModels/notification');

module.exports = {
    getMyNotifications: async (req, res) => {
        try {
            const notifications = await NotificationModel.find({ userId: req.user._id })
                .sort({ createdAt: -1 });
            return res.status(200).send({ message: 'Notifications fetched successfully.', data: notifications });
        } catch (err) {
            console.log('getMyNotifications err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    markAsRead: async (req, res) => {
        try {
            const notification = await NotificationModel.findOne({
                _id: req.params.id,
                userId: req.user._id,
            });
            if (!notification) return res.status(404).send({ message: 'Notification not found.' });
            notification.isRead = true;
            await notification.save();
            return res.status(200).send({ message: 'Notification marked as read.', data: notification });
        } catch (err) {
            console.log('markAsRead err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    markAllAsRead: async (req, res) => {
        try {
            await NotificationModel.updateMany(
                { userId: req.user._id, isRead: false },
                { isRead: true }
            );
            return res.status(200).send({ message: 'All notifications marked as read.' });
        } catch (err) {
            console.log('markAllAsRead err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    createNotification: async (req, res) => {
        try {
            const { userId, title, message, type, relatedType, relatedId } = req.body;
            const notification = await NotificationModel.create({
                userId, title, message, type, relatedType, relatedId,
            });
            return res.status(201).send({ message: 'Notification created successfully.', data: notification });
        } catch (err) {
            console.log('createNotification err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },
};
