const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    pgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PgListing"
    },
    complaintText: String,
    status: {
        type: String,
        enum: ["Open", "Resolved"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
