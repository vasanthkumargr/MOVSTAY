const express = require('express');
const Hostel = require('../models/Hostel');

const router = express.Router();

// Get all hostels
router.get('/', async (req, res) => {
    try {
        const hostels = await Hostel.find();
        res.json(hostels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific hostel
router.get('/:id', async (req, res) => {
    try {
        const hostel = await Hostel.findById(req.params.id);
        if (!hostel) return res.status(404).json({ message: 'Hostel not found' });
        res.json(hostel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Seed data route (temporary, just to populate the DB initially)
router.post('/seed', async (req, res) => {
    try {
        const mockPGs = [
            {
                name: "Sunrise Premium Hostel",
                location: "Koramangala, Bangalore",
                price: "₹12,000/mo",
                rating: 4.8,
                gender: "Boys",
                amenities: ["WiFi", "Food", "AC", "Laundry"],
                image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                name: "Urban Nest PG",
                location: "HSR Layout, Bangalore",
                price: "₹15,000/mo",
                rating: 4.6,
                gender: "Girls",
                amenities: ["WiFi", "AC", "Security"],
                image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                name: "The Co-Living Space",
                location: "Indiranagar, Bangalore",
                price: "₹18,000/mo",
                rating: 4.9,
                gender: "Co-ed",
                amenities: ["WiFi", "Food", "AC", "Security", "Gym"],
                image: "https://images.unsplash.com/photo-1502672260266-1c1e52ab0645?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                name: "Cozy Stay PG",
                location: "BTM Layout, Bangalore",
                price: "₹9,000/mo",
                rating: 4.2,
                gender: "Boys",
                amenities: ["WiFi", "Food"],
                image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                name: "Elite Girls Hostel",
                location: "Koramangala, Bangalore",
                price: "₹14,500/mo",
                rating: 4.7,
                gender: "Girls",
                amenities: ["WiFi", "Food", "Security", "Laundry"],
                image: "https://images.unsplash.com/photo-1505691938895-1758d7feb411?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            }
        ];

        await Hostel.deleteMany({});
        const createdHostels = await Hostel.insertMany(mockPGs);
        res.status(201).json(createdHostels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
