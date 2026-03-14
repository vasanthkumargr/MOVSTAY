const mongoose = require('mongoose');

const VisitBookingSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    pgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PgListing"
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PgRoom"
    },
    visitDate: Date,
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('VisitBooking', VisitBookingSchema);
