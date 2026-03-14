const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    pgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PgListing"
    },
    savedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Favorite', FavoriteSchema);
