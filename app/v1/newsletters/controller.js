const { NewsletterModel } = require('../../../databaseModels/newsletter');

module.exports = {
    subscribe: async (req, res) => {
        try {
            const { email } = req.body;
            const existing = await NewsletterModel.findOne({ email });
            if (existing) {
                if (existing.status === 'unsubscribed') {
                    existing.status = 'active';
                    await existing.save();
                    return res.status(200).send({ message: 'Re-subscribed successfully.', data: existing });
                }
                return res.status(400).send({ message: 'Email is already subscribed.' });
            }
            const newsletter = await NewsletterModel.create({ email });
            return res.status(201).send({ message: 'Subscribed successfully.', data: newsletter });
        } catch (err) {
            console.log('subscribe err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },
    getAllSubscribers: async (req, res) => {
        try {
            const subscribers = await NewsletterModel.find().sort({ createdAt: -1 });
            return res.status(200).send({ message: 'Subscribers fetched successfully.', data: subscribers });
        } catch (err) {
            console.log('getAllSubscribers err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    }
};
