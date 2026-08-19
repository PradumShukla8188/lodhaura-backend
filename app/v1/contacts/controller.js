const { ContactModel } = require('../../../databaseModels/contact');

module.exports = {
    submitContact: async (req, res) => {
        try {
            const { name, email, phone, subject, message } = req.body;
            const contact = await ContactModel.create({
                name,
                email,
                phone,
                subject,
                message,
                userId: req.user?._id,
            });
            return res.status(201).send({ message: 'Contact message submitted successfully.', data: contact });
        } catch (err) {
            console.log('submitContact err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    getAllContacts: async (req, res) => {
        try {
            const contacts = await ContactModel.find().sort({ createdAt: -1 });
            return res.status(200).send({ message: 'Contacts fetched successfully.', data: contacts });
        } catch (err) {
            console.log('getAllContacts err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    updateContactStatus: async (req, res) => {
        try {
            const contact = await ContactModel.findById(req.params.id);
            if (!contact) return res.status(404).send({ message: 'Contact not found.' });
            if (req.body.status) contact.status = req.body.status;
            await contact.save();
            return res.status(200).send({ message: 'Contact updated successfully.', data: contact });
        } catch (err) {
            console.log('updateContactStatus err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },
};
