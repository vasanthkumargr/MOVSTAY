const mongoose = require('mongoose');

const PgReviewSchema = new mongoose.Schema({
    pgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PgListing"
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    reviewText: String,
    sentimentScore: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PgReview', PgReviewSchema);
