const { ProjectModel } = require('../../../databaseModels/project');
const { ComplaintModel } = require('../../../databaseModels/complaint');
const { TaskModel } = require('../../../databaseModels/task');
const { FundTransactionModel } = require('../../../databaseModels/fundTransaction');

// Utility to convert JSON array to CSV string
const jsonToCsv = (items) => {
    if (!items || !items.length) return '';
    const replacer = (key, value) => value === null ? '' : value; // handle null
    const header = Object.keys(items[0]);
    const csv = [
        header.join(','), // header row
        ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n');
    return csv;
};

module.exports = {
    getDashboardStats: async (req, res) => {
        try {
            // Only aggregate if user is an admin or has basic access
            // In a real scenario we'd do a checkPermission, but we'll return global stats.
            
            const totalProjects = await ProjectModel.countDocuments({ isDeleted: false });
            const projects = await ProjectModel.find({ isDeleted: false });
            
            let totalBudget = 0;
            let totalSpent = 0;
            projects.forEach(p => {
                totalBudget += (p.approvedBudget || 0);
                totalSpent += (p.spentAmount || 0);
            });

            const activeComplaints = await ComplaintModel.countDocuments({ isDeleted: false, status: { $nin: ['Resolved', 'Closed', 'resolved', 'dismissed'] } });
            const pendingTasks = await TaskModel.countDocuments({ isDeleted: false, status: { $ne: 'Completed' } });

            return res.status(200).send({ 
                success: true, 
                data: {
                    totalProjects,
                    totalBudget,
                    totalSpent,
                    activeComplaints,
                    pendingTasks
                }
            });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    },

    exportProjects: async (req, res) => {
        try {
            const projects = await ProjectModel.find({ isDeleted: false }).populate('department', 'name').lean();
            const data = projects.map(p => ({
                Name: p.name,
                Village: p.village || '',
                Status: p.status,
                ApprovedBudget: p.approvedBudget || 0,
                SpentAmount: p.spentAmount || 0,
                ProgressPercentage: p.progressPercentage || 0,
                Department: p.department ? p.department.name : ''
            }));
            const csv = jsonToCsv(data);
            res.header('Content-Type', 'text/csv');
            res.attachment('projects_report.csv');
            return res.send(csv);
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    },

    exportTransactions: async (req, res) => {
        try {
            const txs = await FundTransactionModel.find().populate('project', 'name').lean();
            const data = txs.map(tx => ({
                Date: new Date(tx.date).toLocaleDateString(),
                Type: tx.transactionType,
                Amount: tx.amount,
                Project: tx.project ? tx.project.name : 'Global',
                Reference: tx.referenceNumber || '',
                Description: tx.description
            }));
            const csv = jsonToCsv(data);
            res.header('Content-Type', 'text/csv');
            res.attachment('financial_ledger.csv');
            return res.send(csv);
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    },

    exportComplaints: async (req, res) => {
        try {
            const complaints = await ComplaintModel.find({ isDeleted: false }).lean();
            const data = complaints.map(c => ({
                Date: new Date(c.createdAt).toLocaleDateString(),
                Name: c.name,
                Phone: c.phone,
                Subject: c.subject,
                Status: c.status,
                ResolvedAt: c.resolvedAt ? new Date(c.resolvedAt).toLocaleDateString() : ''
            }));
            const csv = jsonToCsv(data);
            res.header('Content-Type', 'text/csv');
            res.attachment('complaints_report.csv');
            return res.send(csv);
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    }
};
