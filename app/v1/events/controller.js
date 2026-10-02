const { EventModel } = require('../../../databaseModels/event');
const { EventRegistrationModel } = require('../../../databaseModels/eventRegistration');
const { EventDonationModel } = require('../../../databaseModels/eventDonation');
const { slugify } = require('../../../helper/slug');
const mongoose = require('mongoose');

module.exports = {
    // ---------------------------------------------------------
    // PUBLIC ROUTES
    // ---------------------------------------------------------
    getAllEvents: async (req, res) => {
        try {
            const filter = { isDeleted: false };
            if (req.query.status) {
                filter.status = req.query.status;
            } else if (!req.query.admin) {
                // Public view: only show published or ongoing
                filter.status = { $in: ['Published', 'Registration Open', 'Registration Closed', 'Ongoing', 'Completed'] };
            }
            
            const events = await EventModel.find(filter)
                .populate('category', 'name slug')
                .populate('responsiblePerson', 'name email')
                .sort({ startDate: 1 });
            return res.status(200).send({ success: true, data: events });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    },

    getEventById: async (req, res) => {
        try {
            const event = await EventModel.findById(req.params.id)
                .populate('category', 'name slug')
                .populate('responsiblePerson', 'name email');
            if (!event || event.isDeleted) return res.status(404).send({ success: false, message: 'Event not found.' });
            return res.status(200).send({ success: true, data: event });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    },

    // ---------------------------------------------------------
    // USER ACTIONS
    // ---------------------------------------------------------
    registerForEvent: async (req, res) => {
        try {
            const event = await EventModel.findById(req.params.id);
            if (!event || event.isDeleted) return res.status(404).send({ success: false, message: 'Event not found.' });
            if (!event.enableRegistration) return res.status(400).send({ success: false, message: 'Registration is not enabled for this event.' });
            
            // Check limits
            if (event.maxParticipants > 0 && event.totalParticipants >= event.maxParticipants) {
                return res.status(400).send({ success: false, message: 'Event has reached maximum capacity.' });
            }

            const { name, mobile, email, attendees, note } = req.body;
            
            const referenceId = `EVT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

            const registration = await EventRegistrationModel.create({
                eventId: event._id,
                userId: req.user._id,
                referenceId,
                name, mobile, email, attendees: attendees || 1, note
            });

            // Update event cached count
            event.totalParticipants += (attendees || 1);
            await event.save();

            return res.status(201).send({ success: true, message: 'Successfully registered for event.', data: registration });
        } catch (err) {
            if (err.code === 11000) return res.status(400).send({ success: false, message: 'You have already registered for this event.' });
            return res.status(500).send({ success: false, message: err.message });
        }
    },

    donateToEvent: async (req, res) => {
        try {
            const event = await EventModel.findById(req.params.id);
            if (!event || event.isDeleted) return res.status(404).send({ success: false, message: 'Event not found.' });
            if (!event.enableDonation) return res.status(400).send({ success: false, message: 'Donations are not enabled for this event.' });

            const { donorName, mobile, email, amount, isAnonymous, message } = req.body;
            
            // Mocking a successful transaction
            const transactionId = `TXN-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

            const donation = await EventDonationModel.create({
                eventId: event._id,
                userId: req.user._id,
                donorName, mobile, email, amount, isAnonymous, message,
                transactionId,
                status: 'Successful'
            });

            // Update event cached total
            event.totalDonations += amount;
            await event.save();

            return res.status(201).send({ success: true, message: 'Donation successful. Thank you!', data: donation });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    },

    // ---------------------------------------------------------
    // ADMIN ACTIONS
    // ---------------------------------------------------------
    createEvent: async (req, res) => {
        try {
            const data = req.body;
            data.userId = req.user._id;
            data.slug = slugify(data.title) + '-' + Date.now();
            
            const event = await EventModel.create(data);
            return res.status(201).send({ success: true, message: 'Event created successfully.', data: event });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    },

    updateEvent: async (req, res) => {
        try {
            const data = req.body;
            if (data.title) data.slug = slugify(data.title) + '-' + Date.now();
            
            const event = await EventModel.findByIdAndUpdate(req.params.id, data, { new: true });
            if (!event) return res.status(404).send({ success: false, message: 'Event not found.' });
            
            // Re-trigger pre-save hooks by saving
            await event.save();

            return res.status(200).send({ success: true, message: 'Event updated successfully.', data: event });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    },

    deleteEvent: async (req, res) => {
        try {
            const event = await EventModel.findById(req.params.id);
            if (!event) return res.status(404).send({ success: false, message: 'Event not found.' });
            
            event.isDeleted = true;
            event.status = 'Cancelled';
            await event.save();
            
            return res.status(200).send({ success: true, message: 'Event deleted successfully.' });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    },

    getEventRegistrations: async (req, res) => {
        try {
            const registrations = await EventRegistrationModel.find({ eventId: req.params.id })
                .populate('userId', 'name email avatar')
                .sort({ createdAt: -1 });
            return res.status(200).send({ success: true, data: registrations });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    },

    updateRegistrationStatus: async (req, res) => {
        try {
            const { status, attendance } = req.body;
            const updateData = {};
            if (status) updateData.status = status;
            if (attendance) updateData.attendance = attendance;

            const registration = await EventRegistrationModel.findByIdAndUpdate(req.params.registrationId, updateData, { new: true });
            if (!registration) return res.status(404).send({ success: false, message: 'Registration not found' });
            
            return res.status(200).send({ success: true, message: 'Participant updated.', data: registration });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    },

    getEventDonations: async (req, res) => {
        try {
            const donations = await EventDonationModel.find({ eventId: req.params.id })
                .sort({ createdAt: -1 });
            return res.status(200).send({ success: true, data: donations });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    }
};
