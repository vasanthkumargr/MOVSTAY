const mongoose = require('mongoose');

const RecommendationLogSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    recommendedPgIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PgListing"
        }
    ],
    algorithmVersion: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('RecommendationLog', RecommendationLogSchema);
