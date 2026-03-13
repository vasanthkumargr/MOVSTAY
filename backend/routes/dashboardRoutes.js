const express = require('express');
const router = express.Router();
const PgListing = require('../models/PgListing');
const PgRoom = require('../models/PgRoom');
const PgAvailability = require('../models/PgAvailability');
const VisitBooking = require('../models/VisitBooking');
const { protect } = require('../middleware/authMiddleware');

// Get owner dashboard statistics
router.get('/owner-stats', protect, async (req, res) => {
    try {
        // 1. Total PGs
        const ownerPgs = await PgListing.find({ ownerId: req.user._id });
        const ownerPgIds = ownerPgs.map(pg => pg._id);
        const totalPgs = ownerPgs.length;

        // 2. Total Rooms & Total Bed Capacity
        const rooms = await PgRoom.find({ pgId: { $in: ownerPgIds } });
        const totalRooms = rooms.length;

        // Calculate total bed capacity across all rooms
        const totalBedCapacity = rooms.reduce((sum, room) => sum + (room.totalBeds || room.sharingCapacity || 0), 0);

        // 3. Available Beds
        const roomIds = rooms.map(r => r._id);
        const availabilities = await PgAvailability.find({ roomId: { $in: roomIds } });
        const availableBeds = availabilities.reduce((sum, avail) => sum + (avail.availableBeds || 0), 0);

        // 4. Occupancy Rate
        // Occupancy = ((Total Capacity - Available Beds) / Total Capacity) * 100
        let occupancyRate = 0;
        if (totalBedCapacity > 0) {
            occupancyRate = Number((((totalBedCapacity - availableBeds) / totalBedCapacity) * 100).toFixed(1));
            if (isNaN(occupancyRate) || occupancyRate < 0) occupancyRate = 0;
        }

        // 5. Visit Requests (Actual count from DB for owner's PGs)
        const visitRequests = await VisitBooking.countDocuments({ pgId: { $in: ownerPgIds } });

        // 6. Recent Listings (Top 5 created recently by owner)
        const recentListings = await PgListing.find({ ownerId: req.user._id }).sort({ createdAt: -1 }).limit(5);

        // 7. Recent Activity (Mocked based on recent listings)
        const recentActivity = recentListings.map(listing => ({
            id: listing._id,
            description: `New listing "${listing.pgName}" added in ${listing.location}`,
            date: listing.createdAt || new Date()
        }));

        res.json({
            totalPgs,
            totalRooms,
            totalBedCapacity,
            availableBeds,
            occupancyRate,
            visitRequests,
            recentListings,
            recentActivity
        });
    } catch (err) {
        console.error("Dashboard Stats Error:", err);
        res.status(500).json({ message: 'Error fetching dashboard stats', error: err.message });
    }
});

module.exports = router;
