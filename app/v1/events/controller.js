const { EventModel } = require('../../../databaseModels/event');
const { slugify } = require('../../../helper/slug');

module.exports = {
    getAllEvents: async (req, res) => {
        try {
            const filter = { isDeleted: false };
            if (req.query.status) filter.status = req.query.status;
            else filter.status = { $in: ['approved', 'active'] };
            const events = await EventModel.find(filter)
                .populate('userId', 'name')
                .populate('category', 'name slug')
                .sort({ startDate: 1 });
            return res.status(200).send({ message: 'Events fetched successfully.', data: events });
        } catch (err) {
            console.log('getAllEvents err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    getEventById: async (req, res) => {
        try {
            const event = await EventModel.findById(req.params.id)
                .populate('userId', 'name')
                .populate('category', 'name slug');
            if (!event) return res.status(404).send({ message: 'Event not found.' });
            return res.status(200).send({ message: 'Event fetched successfully.', data: event });
        } catch (err) {
            console.log('getEventById err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    createEvent: async (req, res) => {
        try {
            const { title, description, startDate, endDate, location, featuredImage, organizer, category } = req.body;
            const slug = slugify(title) + '-' + Date.now();
            const event = await EventModel.create({
                title,
                slug,
                description,
                startDate,
                endDate,
                location,
                featuredImage,
                organizer,
                category,
                userId: req.user._id,
            });
            return res.status(201).send({ message: 'Event created successfully.', data: event });
        } catch (err) {
            console.log('createEvent err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    updateEvent: async (req, res) => {
        try {
            const event = await EventModel.findById(req.params.id);
            if (!event) return res.status(404).send({ message: 'Event not found.' });
            const fields = ['title', 'description', 'startDate', 'endDate', 'location', 'featuredImage', 'organizer', 'category', 'status'];
            fields.forEach((f) => { if (req.body[f] !== undefined) event[f] = req.body[f]; });
            if (req.body.title) event.slug = slugify(req.body.title) + '-' + Date.now();
            await event.save();
            return res.status(200).send({ message: 'Event updated successfully.', data: event });
        } catch (err) {
            console.log('updateEvent err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    deleteEvent: async (req, res) => {
        try {
            const event = await EventModel.findById(req.params.id);
            if (!event) return res.status(404).send({ message: 'Event not found.' });
            event.isDeleted = true;
            await event.save();
            return res.status(200).send({ message: 'Event deleted successfully.' });
        } catch (err) {
            console.log('deleteEvent err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },
};
