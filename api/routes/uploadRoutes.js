const express = require('express');
const router = express.Router();
const { upload } = require('../utils/cloudinary');

// POST /api/upload
// Expects an array of files under the field name 'images'
router.post('/', upload.array('images', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No image files provided.' });
        }

        // Map the uploaded files to get their secure Cloudinary URLs
        const imageUrls = req.files.map(file => file.path);

        res.status(200).json({
            message: 'Images uploaded successfully',
            imageUrls: imageUrls
        });
    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json({ message: 'Error uploading images to Cloudinary.', error: error.message });
    }
});

module.exports = router;
