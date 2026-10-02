const { MeetingModel } = require('../../../databaseModels/meeting');

module.exports = {
    getAllMeetings: async (req, res) => {
        try {
            const meetings = await MeetingModel.find({ isDeleted: false })
                .populate('participants', 'name email designation')
                .populate('actionItems.responsiblePerson', 'name email')
                .sort({ date: -1 });
            return res.status(200).send({ success: true, data: meetings });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    },

    createMeeting: async (req, res) => {
        try {
            const meeting = await MeetingModel.create(req.body);
            return res.status(201).send({ success: true, data: meeting, message: 'Meeting recorded successfully.' });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    },

    updateMeeting: async (req, res) => {
        try {
            const meeting = await MeetingModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!meeting) return res.status(404).send({ success: false, message: 'Meeting not found.' });
            return res.status(200).send({ success: true, data: meeting, message: 'Meeting updated successfully.' });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    },

    deleteMeeting: async (req, res) => {
        try {
            const meeting = await MeetingModel.findByIdAndUpdate(req.params.id, { isDeleted: true });
            if (!meeting) return res.status(404).send({ success: false, message: 'Meeting not found.' });
            return res.status(200).send({ success: true, message: 'Meeting deleted successfully.' });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    }
};
