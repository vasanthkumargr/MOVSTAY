const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    pgId: { type: String, required: true },
    pgName: { type: String, required: true },
    userEmail: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    moveInDate: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
