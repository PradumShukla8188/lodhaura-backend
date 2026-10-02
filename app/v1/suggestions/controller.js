const { SuggestionModel } = require('../../../databaseModels/suggestion');

module.exports = {
    submitSuggestion: async (req, res) => {
        try {
            const { name, email, topic, suggestion } = req.body;
            const sugg = await SuggestionModel.create({
                name, email, topic, suggestion
            });
            return res.status(201).send({ message: 'Suggestion registered successfully.', data: sugg });
        } catch (err) {
            console.log('submitSuggestion err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },
    getAllSuggestions: async (req, res) => {
        try {
            const suggestions = await SuggestionModel.find().sort({ createdAt: -1 });
            return res.status(200).send({ message: 'Suggestions fetched successfully.', data: suggestions });
        } catch (err) {
            console.log('getAllSuggestions err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    }
};
