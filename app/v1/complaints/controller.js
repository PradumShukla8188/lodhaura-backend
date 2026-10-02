const { ComplaintModel } = require('../../../databaseModels/complaint');

module.exports = {
    submitComplaint: async (req, res) => {
        try {
            const { name, phone, category, subject, description } = req.body;
            let userId = null;
            
            const authHeader = req.headers['authorization'];
            if (authHeader) {
                const token = authHeader.split(' ')[1];
                if (token) {
                    try {
                        const { verifyToken } = require('../../../helper/jwt');
                        const decoded = verifyToken(token);
                        if (decoded && decoded.id) {
                            userId = decoded.id;
                        }
                    } catch (e) {
                        // Ignore token errors for public submission
                    }
                }
            }

            const complaint = await ComplaintModel.create({
                name, phone, category, subject, description, userId
            });
            return res.status(201).send({ message: 'Complaint registered successfully.', data: complaint });
        } catch (err) {
            console.log('submitComplaint err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },
    getMyComplaints: async (req, res) => {
        try {
            const complaints = await ComplaintModel.find({ userId: req.user._id, isDeleted: false })
                .populate('assignedTo', 'name')
                .populate('department', 'name')
                .sort({ createdAt: -1 });
            return res.status(200).send({ success: true, message: 'My complaints fetched successfully.', data: complaints });
        } catch (err) {
            console.log('getMyComplaints err', err?.message || err);
            return res.status(500).send({ success: false, message: err?.message || 'Internal server error.' });
        }
    },
    getAllComplaints: async (req, res) => {
        try {
            const complaints = await ComplaintModel.find({ isDeleted: false })
                .populate('assignedTo', 'name email')
                .populate('department', 'name')
                .sort({ createdAt: -1 });
            return res.status(200).send({ success: true, message: 'Complaints fetched successfully.', data: complaints });
        } catch (err) {
            console.log('getAllComplaints err', err?.message || err);
            return res.status(500).send({ success: false, message: err?.message || 'Internal server error.' });
        }
    },
    updateComplaint: async (req, res) => {
        try {
            const { status, assignedTo, department, resolutionRemarks } = req.body;
            const updateData = { status, assignedTo, department, resolutionRemarks };
            if (status === 'Resolved' || status === 'Closed') {
                updateData.resolvedAt = Date.now();
            }
            
            const complaint = await ComplaintModel.findByIdAndUpdate(req.params.id, updateData, { new: true });
            if (!complaint) return res.status(404).send({ success: false, message: 'Complaint not found' });
            
            return res.status(200).send({ success: true, message: 'Complaint updated successfully.', data: complaint });
        } catch (err) {
            return res.status(500).send({ success: false, message: err?.message || 'Internal server error.' });
        }
    }
};
