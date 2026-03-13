const mongoose = require('mongoose');

const NeighborhoodSchema = new mongoose.Schema({
    locationName: {
        type: String,
        required: true
    },
    city: String,
    safetyScore: Number,
    transportScore: Number,
    convenienceScore: Number,
    lifestyleScore: Number,
    environmentScore: Number,
    averageRent: Number,
    nearbyHospitals: [String],
    nearbyColleges: [String],
    nearbyTransport: [String],
    popularAmenities: [String]
});

module.exports = mongoose.model('Neighborhood', NeighborhoodSchema);
