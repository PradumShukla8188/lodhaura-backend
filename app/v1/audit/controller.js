const { AuditLogModel } = require('../../../databaseModels/auditLog');

module.exports = {
    getAuditLogs: async (req, res) => {
        try {
            const logs = await AuditLogModel.find()
                .populate('user', 'name email roleName')
                .sort({ createdAt: -1 })
                .limit(500); // Limit to last 500 logs for performance
            return res.status(200).send({ success: true, data: logs });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    }
};
