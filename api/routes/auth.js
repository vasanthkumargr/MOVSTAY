const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Set up Gmail SMTP Transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASS
    }
});

transporter.verify((error) => {
    if (error) {
        console.error('❌ Gmail SMTP connection failed:', error.message);
        console.log('💡 Make sure EMAIL_USER and EMAIL_APP_PASS are set in .env');
    } else {
        console.log('📧 Gmail SMTP ready — OTPs will be sent to real emails!');
    }
});

// Helper function to generate OTP
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

const sendOtpEmail = async (email, otp, subject) => {
    try {
        await transporter.sendMail({
            from: `"MOVStay 🏡" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: subject,
            text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
            html: `<div style="font-family: Arial, sans-serif; padding: 20px; max-width: 480px; margin: auto; background: #f9f9f9; border-radius: 8px;">
                    <h2 style="color: #6366f1;">MOVStay 🏡</h2>
                    <p style="font-size: 16px;">Your One-Time Password (OTP) is:</p>
                    <h1 style="color: #6366f1; letter-spacing: 8px; font-size: 40px;">${otp}</h1>
                    <p style="color: #555;">This code will expire in <strong>10 minutes</strong>. Do not share it with anyone.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #aaa; font-size: 12px;">If you did not request this OTP, please ignore this email.</p>
                   </div>`
        });
        console.log(`✅ OTP email sent to: ${email}`);
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        throw new Error('Failed to send OTP email. Check backend Gmail credentials.');
    }
};


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
            return res.status(400).json({ message: 'Invalid password. Try another login method if applicable.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // In a real app we'd send a JWT token here.
        res.status(200).json({ 
            message: 'Login successful', 
            user: { email: user.email, id: user._id } 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
