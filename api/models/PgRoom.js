const mongoose = require('mongoose');

const PgRoomSchema = new mongoose.Schema({
    pgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PgListing"
    },
    roomType: {
        type: String,
        enum: ["Single", "Double", "Triple", "Dormitory"]
    },
    sharingCapacity: Number,
    totalBeds: Number,
    roomRent: Number,
    acAvailable: Boolean
});

module.exports = mongoose.model('PgRoom', PgRoomSchema);
