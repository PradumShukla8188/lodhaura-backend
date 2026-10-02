const { FundTransactionModel } = require('../../../databaseModels/fundTransaction');
const { ProjectModel } = require('../../../databaseModels/project');
const { AuditLogModel } = require('../../../databaseModels/auditLog');

const logAudit = async (req, action, module, targetId, details) => {
    try {
        await AuditLogModel.create({
            user: req.user._id,
            action,
            module,
            targetId,
            details,
            ipAddress: req.ip || req.connection.remoteAddress
        });
    } catch (err) {
        console.error('Audit Log Error:', err);
    }
};

module.exports = {
    getTransactions: async (req, res) => {
        try {
            const transactions = await FundTransactionModel.find()
                .populate('project', 'name code')
                .populate('createdBy', 'name email')
                .sort({ date: -1 });
            return res.status(200).send({ success: true, data: transactions });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    },

    getProjectTransactions: async (req, res) => {
        try {
            const transactions = await FundTransactionModel.find({ project: req.params.id })
                .populate('createdBy', 'name email')
                .sort({ date: -1 });
            return res.status(200).send({ success: true, data: transactions });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    },

    createTransaction: async (req, res) => {
        try {
            const { project: projectId, transactionType, amount, date, referenceNumber, description, source, documentUrl } = req.body;
            
            const project = await ProjectModel.findById(projectId);
            if (!project || project.isDeleted) {
                return res.status(404).send({ success: false, message: 'Project not found.' });
            }

            const oldState = {
                approvedBudget: project.approvedBudget,
                releasedFund: project.releasedFund,
                spentAmount: project.spentAmount
            };

            const transaction = await FundTransactionModel.create({
                project: projectId,
                transactionType,
                amount: Number(amount),
                date: date || Date.now(),
                referenceNumber,
                description,
                source,
                documentUrl,
                createdBy: req.user._id
            });

            // Update Project Financials
            const numAmount = Number(amount);
            if (transactionType === 'Fund Sanctioned') {
                project.approvedBudget = (project.approvedBudget || 0) + numAmount;
            } else if (transactionType === 'Fund Released' || transactionType === 'Fund Received') {
                project.releasedFund = (project.releasedFund || 0) + numAmount;
            } else if (transactionType === 'Payment' || transactionType === 'Expense') {
                project.spentAmount = (project.spentAmount || 0) + numAmount;
            } else if (transactionType === 'Adjustment') {
                // Adjustment assumes negative or positive values passed explicitly to fix errors
                // We'll apply it to spentAmount for simplicity, or we can make it complex.
                // Assuming it's an adjustment on spent amount.
                project.spentAmount = (project.spentAmount || 0) + numAmount;
            }

            await project.save();

            const newState = {
                approvedBudget: project.approvedBudget,
                releasedFund: project.releasedFund,
                spentAmount: project.spentAmount
            };

            // Log Audit
            await logAudit(req, 'CREATE_TRANSACTION', 'Funds', transaction._id, {
                transactionType, amount: numAmount, oldState, newState
            });

            return res.status(201).send({ success: true, data: transaction, message: 'Transaction logged successfully.' });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    }
};
