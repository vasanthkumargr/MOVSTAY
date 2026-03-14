const express = require('express');
const router = express.Router();
const PgRoom = require('../models/PgRoom');
const PgListing = require('../models/PgListing');
const { protect } = require('../middleware/authMiddleware');

// Get all Rooms for the logged-in owner
router.get('/', protect, async (req, res) => {
    try {
        // First get all PGs owned by this user
        const ownerPgs = await PgListing.find({ ownerId: req.user._id });
        const ownerPgIds = ownerPgs.map(pg => pg._id);

        // Fetch rooms that belong to these PGs
        const rooms = await PgRoom.find({ pgId: { $in: ownerPgIds } }).populate({
            path: 'pgId',
            select: 'pgName',
            match: { ownerId: req.user._id }
        });

        // Filter out rooms where pgId is null (in case of orphan rooms or mismatches)
        const filteredRooms = rooms.filter(room => room.pgId != null);

        res.json(filteredRooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Versatile Search Route
router.get('/search/:query', protect, async (req, res) => {
    try {
        const query = req.params.query;
        const searchRegex = new RegExp(query, 'i');

        // First get all PGs owned by this user
        const ownerPgs = await PgListing.find({ ownerId: req.user._id });
        const ownerPgIds = ownerPgs.map(pg => pg._id);

        let searchCriteria = [
            { roomType: searchRegex }
        ];

        if (!isNaN(query)) {
            searchCriteria.push({ sharingCapacity: Number(query) });
            searchCriteria.push({ roomRent: Number(query) });
            searchCriteria.push({ totalBeds: Number(query) });
        }

        if (query.match(/^[0-9a-fA-F]{24}$/)) {
            searchCriteria.push({ _id: query });
            searchCriteria.push({ pgId: query });
        }

        const rooms = await PgRoom.find({
            $and: [
                { pgId: { $in: ownerPgIds } },
                { $or: searchCriteria }
            ]
        }).populate({
            path: 'pgId',
            select: 'pgName',
            match: { ownerId: req.user._id }
        });

        const filteredRooms = rooms.filter(room => room.pgId != null);

        res.json(filteredRooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get room by ID
router.get('/:id', protect, async (req, res) => {
    try {
        // First get all PGs owned by this user
        const ownerPgs = await PgListing.find({ ownerId: req.user._id });
        const ownerPgIds = ownerPgs.map(pg => pg._id);

        const room = await PgRoom.findOne({
            _id: req.params.id,
            pgId: { $in: ownerPgIds }
        }).populate('pgId', 'pgName');

        if (!room) return res.status(404).json({ message: 'Room not found or unauthorized' });
        res.json(room);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create Room
router.post('/', protect, async (req, res) => {
    try {
        // Verify the user owns the PG they are adding a room to
        const pg = await PgListing.findOne({ _id: req.body.pgId, ownerId: req.user._id });
        if (!pg) {
            return res.status(403).json({ message: 'Unauthorized: You do not own this PG' });
        }

        const room = new PgRoom(req.body);
        const newRoom = await room.save();
        res.status(201).json(newRoom);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update Room
router.put('/:id', protect, async (req, res) => {
    try {
        // First get all PGs owned by this user
        const ownerPgs = await PgListing.find({ ownerId: req.user._id });
        const ownerPgIds = ownerPgs.map(pg => pg._id);

        // Verify room belongs to owner
        const room = await PgRoom.findOne({
            _id: req.params.id,
            pgId: { $in: ownerPgIds }
        });

        if (!room) {
            return res.status(404).json({ message: 'Room not found or unauthorized' });
        }

        // If changing pgId, verify owner owns the new PG too
        if (req.body.pgId && req.body.pgId !== room.pgId.toString()) {
            const newPg = await PgListing.findOne({ _id: req.body.pgId, ownerId: req.user._id });
            if (!newPg) {
                return res.status(403).json({ message: 'Unauthorized: You do not own the target PG' });
            }
        }

        const updatedRoom = await PgRoom.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedRoom);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete Room
router.delete('/:id', protect, async (req, res) => {
    try {
        // First get all PGs owned by this user
        const ownerPgs = await PgListing.find({ ownerId: req.user._id });
        const ownerPgIds = ownerPgs.map(pg => pg._id);

        const room = await PgRoom.findOneAndDelete({
            _id: req.params.id,
            pgId: { $in: ownerPgIds }
        });

        if (!room) return res.status(404).json({ message: 'Room not found or unauthorized' });
        res.json({ message: 'Room deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
