const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    college: String,
    gender: {
        type: String,
        enum: ["Male", "Female"]
    },
    preferredLocation: String,
    budget: Number,
    preferredRoomType: {
        type: String,
        enum: ["Single", "Double", "Triple", "Dormitory"]
    },
    foodPreference: {
        type: String,
        enum: ["Veg", "Non-Veg", "Any"]
    },
    smokingPreference: Boolean,
    sleepTime: String,
    cleanlinessLevel: String
});

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);
