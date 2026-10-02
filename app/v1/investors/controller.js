const { InvestorInquiryModel } = require('../../../databaseModels/investorInquiry');

module.exports = {
    submitInquiry: async (req, res) => {
        try {
            const { name, organization, email, phone, investmentType, website, message } = req.body;
            const inquiry = await InvestorInquiryModel.create({
                name, organization, email, phone, investmentType, website, message
            });
            return res.status(201).send({ message: 'Investor inquiry submitted successfully.', data: inquiry });
        } catch (err) {
            console.log('submitInquiry err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },
    getAllInquiries: async (req, res) => {
        try {
            const inquiries = await InvestorInquiryModel.find().sort({ createdAt: -1 });
            return res.status(200).send({ message: 'Inquiries fetched successfully.', data: inquiries });
        } catch (err) {
            console.log('getAllInquiries err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    }
};
