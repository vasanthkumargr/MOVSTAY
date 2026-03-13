const express = require('express');
const router = express.Router();
const PgAvailability = require('../models/PgAvailability');
const PgRoom = require('../models/PgRoom');
const PgListing = require('../models/PgListing');
const { protect } = require('../middleware/authMiddleware');

// Get all Availability Records for owner's rooms
router.get('/', protect, async (req, res) => {
    try {
        // 1. Get owner's PGs
        const ownerPgs = await PgListing.find({ ownerId: req.user._id });
        const ownerPgIds = ownerPgs.map(pg => pg._id);

        // 2. Get rooms belonging to those PGs
        const ownerRooms = await PgRoom.find({ pgId: { $in: ownerPgIds } });
        const ownerRoomIds = ownerRooms.map(room => room._id);

        // 3. Find availability records for those rooms
        const records = await PgAvailability.find({ roomId: { $in: ownerRoomIds } })
            .populate({
                path: 'roomId',
                select: 'roomType totalBeds pgId',
                populate: { path: 'pgId', select: 'pgName' }
            });

        // Filter out records where roomId is null
        const filteredRecords = records.filter(record => record.roomId != null);
        res.json(filteredRecords);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update or Create Availability for a Room
router.put('/:roomId', protect, async (req, res) => {
    try {
        const { availableBeds, status } = req.body;

        // 1. Get owner's PGs
        const ownerPgs = await PgListing.find({ ownerId: req.user._id });
        const ownerPgIds = ownerPgs.map(pg => pg._id);

        // 2. Check if room exists and belongs to the owner's PGs
        const room = await PgRoom.findOne({
            _id: req.params.roomId,
            pgId: { $in: ownerPgIds }
        });

        if (!room) return res.status(404).json({ message: 'Room not found or unauthorized' });

        // Find existing availability or create new
        let availability = await PgAvailability.findOne({ roomId: req.params.roomId });

        if (availability) {
            availability.availableBeds = availableBeds;
            availability.status = status;
            availability.lastUpdatedOn = Date.now();
            await availability.save();
            res.json(availability);
        } else {
            const newAvailability = new PgAvailability({
                roomId: req.params.roomId,
                availableBeds,
                status,
                lastUpdatedOn: Date.now()
            });
            await newAvailability.save();
            res.status(201).json(newAvailability);
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
