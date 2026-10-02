const { MarketplaceItemModel } = require('../../../databaseModels/marketplaceItem');

module.exports = {
    getAllMarketplaceItems: async (req, res) => {
        try {
            const { category, search, status, admin } = req.query;
            let query = { isDeleted: false, status: 'available' };
            
            if (admin) query = { isDeleted: false };
            else if (status) query.status = status;

            if (category && category !== 'All') query.category = category;

            if (search) {
                query.$or = [
                    { itemName: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { sellerName: { $regex: search, $options: 'i' } }
                ];
            }

            const items = await MarketplaceItemModel.find(query).sort({ createdAt: -1 }).populate('userId', 'name avatar');
            return res.status(200).send({ success: true, message: 'Marketplace items fetched.', data: items });
        } catch (err) {
            console.log('getAllMarketplaceItems err', err);
            return res.status(500).send({ success: false, message: 'Internal server error.' });
        }
    },

    createMarketplaceItem: async (req, res) => {
        try {
            const item = await MarketplaceItemModel.create({
                ...req.body,
                userId: req.user._id,
                status: 'available'
            });
            return res.status(201).send({ success: true, message: 'Item listed successfully.', data: item });
        } catch (err) {
            return res.status(500).send({ success: false, message: err?.message || 'Error' });
        }
    },

    updateMarketplaceItemStatus: async (req, res) => {
        try {
            const { status } = req.body;
            const item = await MarketplaceItemModel.findOneAndUpdate(
                { _id: req.params.id, userId: req.user._id },
                { status },
                { new: true }
            );
            if (!item) return res.status(404).send({ success: false, message: 'Not found or unauthorized' });
            return res.status(200).send({ success: true, message: 'Status updated', data: item });
        } catch (err) {
            return res.status(500).send({ success: false, message: err?.message || 'Error' });
        }
    },
    
    deleteMarketplaceItem: async (req, res) => {
        try {
            const item = await MarketplaceItemModel.findOneAndUpdate(
                { _id: req.params.id, userId: req.user._id },
                { isDeleted: true }
            );
        } catch (err) {
            return res.status(500).send({ success: false, message: err?.message || 'Error' });
        }
    },

    // Admin functions
    getAdminMarketplaceItems: async (req, res) => {
        try {
            const { page = 1, limit = 20, search = '' } = req.query;
            const query = { isDeleted: false };
            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { category: { $regex: search, $options: 'i' } }
                ];
            }

            const skip = (Number(page) - 1) * Number(limit);
            
            const [items, total] = await Promise.all([
                MarketplaceItemModel.find(query)
                    .populate('userId', 'name avatar email')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(Number(limit)),
                MarketplaceItemModel.countDocuments(query)
            ]);

            return res.status(200).json({ 
                success: true, 
                data: items,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    totalRecords: total,
                    totalPages: Math.ceil(total / Number(limit)),
                    hasNextPage: skip + Number(limit) < total,
                    hasPreviousPage: Number(page) > 1
                }
            });
        } catch (err) {
            return res.status(500).send({ success: false, message: 'Internal server error.' });
        }
    },

    updateMarketplaceItemStatusAdmin: async (req, res) => {
        try {
            const { status } = req.body;
            const item = await MarketplaceItemModel.findByIdAndUpdate(
                req.params.id, 
                { status },
                { new: true }
            );
            if (!item) return res.status(404).send({ success: false, message: 'Not found' });
            return res.status(200).send({ success: true, message: 'Status updated', data: item });
        } catch (err) {
            return res.status(500).send({ success: false, message: err?.message || 'Error' });
        }
    },

    deleteMarketplaceItemAdmin: async (req, res) => {
        try {
            const item = await MarketplaceItemModel.findByIdAndUpdate(req.params.id, { isDeleted: true });
            if (!item) return res.status(404).send({ success: false, message: 'Not found' });
            return res.status(200).send({ success: true, message: 'Item deleted successfully' });
        } catch (err) {
            return res.status(500).send({ success: false, message: err?.message || 'Error' });
        }
    }
};
