const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// 1. Register: Create new user with password
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            email,
            password: hashedPassword,
            isVerified: true
        });

        await user.save();

        res.status(200).json({
            message: 'Registration successful. You can now log in.',
            user: { email: user.email, id: user._id }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. Login: Authenticate with email and password
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found. Please register first.' });
        }

        if (!user.password) {
            return res.status(400).json({ message: 'This account uses a different login method.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({
            message: 'Login successful',
            user: { email: user.email, id: user._id }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
