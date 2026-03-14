const express = require('express');
const router = express.Router();
const PgListing = require('../models/PgListing');
const { protect } = require('../middleware/authMiddleware');

// Get all PG Listings
router.get('/', protect, async (req, res) => {
    try {
        const listings = await PgListing.find({ ownerId: req.user._id });
        res.json(listings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Versatile Search Route
router.get('/search/:query', protect, async (req, res) => {
    try {
        const query = req.params.query;
        const searchRegex = new RegExp(query, 'i');

        let searchCriteria = [
            { pgName: searchRegex },
            { location: searchRegex },
            { address: searchRegex },
            { genderPreference: searchRegex }
        ];

        if (query.match(/^[0-9a-fA-F]{24}$/)) {
            searchCriteria.push({ _id: query });
        }

        const listings = await PgListing.find({
            $and: [
                { ownerId: req.user._id },
                { $or: searchCriteria }
            ]
        });
        res.json(listings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single PG Listing
router.get('/:id', protect, async (req, res) => {
    try {
        const listing = await PgListing.findOne({ _id: req.params.id, ownerId: req.user._id });
        if (!listing) return res.status(404).json({ message: 'Listing not found or unauthorized' });
        res.json(listing);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create PG Listing
router.post('/', protect, async (req, res) => {
    req.body.ownerId = req.user._id;
    const listing = new PgListing(req.body);
    try {
        const newListing = await listing.save();
        res.status(201).json(newListing);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update PG Listing
router.put('/:id', protect, async (req, res) => {
    try {
        const updatedListing = await PgListing.findOneAndUpdate(
            { _id: req.params.id, ownerId: req.user._id },
            req.body,
            { new: true }
        );
        if (!updatedListing) return res.status(404).json({ message: 'Listing not found or unauthorized' });
        res.json(updatedListing);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete PG Listing
router.delete('/:id', protect, async (req, res) => {
    try {
        const deletedListing = await PgListing.findOneAndDelete({ _id: req.params.id, ownerId: req.user._id });
        if (!deletedListing) return res.status(404).json({ message: 'Listing not found or unauthorized' });
        res.json({ message: 'Listing deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
