const mongoose = require('mongoose');

const RoommateMatchSchema = new mongoose.Schema({
    studentA: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    studentB: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    compatibilityScore: Number,
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"]
    }
});

module.exports = mongoose.model('RoommateMatch', RoommateMatchSchema);
