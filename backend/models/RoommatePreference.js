const mongoose = require('mongoose');

const RoommatePreferenceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    sleepTime: String,
    cleanlinessLevel: String,
    smoking: Boolean,
    studyHabits: String,
    budget: Number
});

module.exports = mongoose.model('RoommatePreference', RoommatePreferenceSchema);
