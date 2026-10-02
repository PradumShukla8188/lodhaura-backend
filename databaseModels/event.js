const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    // Basic Information
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true, trim: true },
    shortDescription: { type: String, default: '' },
    description: { type: String, default: '' },
    category: { type: mongoose.Types.ObjectId, ref: 'Category' },
    
    // Images
    featuredImage: { type: String, default: '' },
    galleryImages: [{ type: String }],
    
    // Date & Time
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    startTime: { type: String },
    endTime: { type: String },
    registrationStartDate: { type: Date },
    registrationEndDate: { type: Date },
    
    // Location
    venueName: { type: String, default: '' },
    address: { type: String, default: '' },
    village: { type: String, default: '' },
    landmark: { type: String, default: '' },
    mapLocation: { type: String, default: '' },
    
    // Organizer
    organizer: { type: String, default: '' }, // Name
    organizerContact: { type: String, default: '' },
    organizerEmail: { type: String, default: '' },
    responsiblePerson: { type: mongoose.Types.ObjectId, ref: 'User' },
    
    // Participation
    enableRegistration: { type: Boolean, default: false },
    maxParticipants: { type: Number, default: 0 }, // 0 = unlimited
    registrationFee: { type: Number, default: 0 },
    allowGuest: { type: Boolean, default: false },
    
    // Donation
    enableDonation: { type: Boolean, default: false },
    donationGoal: { type: Number, default: 0 },
    totalDonations: { type: Number, default: 0 }, // Aggregated cache
    donationDescription: { type: String, default: '' },
    donationDeadline: { type: Date },
    donationPurpose: { type: String, default: '' },
    
    // Metrics (cached for quick read)
    totalParticipants: { type: Number, default: 0 },
    
    // Status & Visibility
    status: { 
        type: String, 
        enum: ['Draft', 'Published', 'Registration Open', 'Registration Closed', 'Ongoing', 'Completed', 'Cancelled'], 
        default: 'Draft' 
    },
    isFeatured: { type: Boolean, default: false },
    
    // Meta
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

// Pre-save hook to determine status dynamically if Published
EventSchema.pre('save', function (next) {
    if (this.status !== 'Draft' && this.status !== 'Cancelled' && this.status !== 'Completed') {
        const now = new Date();
        if (this.registrationStartDate && this.registrationEndDate) {
            if (now >= this.registrationStartDate && now <= this.registrationEndDate) {
                this.status = 'Registration Open';
            } else if (now > this.registrationEndDate) {
                this.status = 'Registration Closed';
            }
        } else {
            this.status = 'Published';
        }
        
        if (now >= this.startDate && now <= (this.endDate || this.startDate)) {
            this.status = 'Ongoing';
        } else if (now > (this.endDate || this.startDate)) {
            this.status = 'Completed';
        }
    }
    next();
});

module.exports = { EventModel: mongoose.model('Event', EventSchema) };
