const mongoose = require('mongoose');

const PgListingSchema = new mongoose.Schema({
    pgName: {
        type: String,
        required: true
    },
    address: String,
    location: String,
    neighborhoodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Neighborhood'
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    rent: Number,
    genderPreference: {
        type: String,
        enum: ['Boys', 'Girls', 'Co-ed']
    },
    amenities: {
        wifi: Boolean,
        food: Boolean,
        laundry: Boolean,
        parking: Boolean,
        powerBackup: Boolean,
        cctv: Boolean,
        gym: Boolean,
        studyRoom: Boolean
    },
    images: [String],
    description: String,
    ratingAverage: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PgListing', PgListingSchema);
