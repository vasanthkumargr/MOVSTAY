const mongoose = require('mongoose');

const PgAvailabilitySchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PgRoom"
    },
    availableBeds: Number,
    status: {
        type: String,
        enum: ["Available", "Limited", "Full"]
    },
    lastUpdatedOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PgAvailability', PgAvailabilitySchema);
