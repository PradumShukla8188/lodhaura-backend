const mongoose = require('mongoose');

const MarketplaceItemSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    itemName: { type: String, required: true, trim: true },
    category: { type: String, enum: ['Livestock', 'Crops', 'Handicrafts', 'Equipment', 'Other'], required: true },
    description: { type: String, required: true },
    price: { type: String, required: true }, // e.g. "5000 Rs" or "20 Rs/kg"
    sellerName: { type: String, required: true, trim: true },
    contactPhone: { type: String, required: true },
    photos: [{ type: String }],
    status: { type: String, enum: ['available', 'sold', 'hidden'], default: 'available' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = { MarketplaceItemModel: mongoose.model('MarketplaceItem', MarketplaceItemSchema) };
