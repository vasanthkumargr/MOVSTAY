const express = require('express');
const Booking = require('../models/Booking');

const router = express.Router();

// POST /api/bookings - Create a new booking
router.post('/', async (req, res) => {
    try {
        const { pgId, pgName, userEmail, name, phone, moveInDate } = req.body;

        if (!pgId || !pgName || !name || !phone || !moveInDate) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const booking = new Booking({
            pgId,
            pgName,
            userEmail: userEmail || 'guest',
            name,
            phone,
            moveInDate: new Date(moveInDate)
        });

        await booking.save();
        res.status(201).json({ message: 'Booking request created successfully!', booking });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/bookings - Get all bookings (for admin/dashboard)
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/bookings/user/:email - Get bookings for a specific user
router.get('/user/:email', async (req, res) => {
    try {
        const bookings = await Booking.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
