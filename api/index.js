require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || origin.includes('localhost') || origin.includes('vercel.app') || origin === process.env.FRONTEND_URL) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS (' + origin + ')'));
        }
    },
    credentials: true,
}));
app.use(express.json());

// ── MongoDB Connection (must be before routes) ───────────────────
let isConnected = false;

const connectToDatabase = async () => {
    if (isConnected) return;
    const db = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = db.connections[0].readyState;
    console.log('✅ Connected to MongoDB (mov_stay)');
};

// Connect to DB before every request so routes always have a live connection
app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err.message);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// ── Student-side Routes ──────────────────────────────────────────
const hostelRoutes = require('./routes/hostels');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const requirementsRoutes = require('./routes/requirements');

app.use('/api/hostels', hostelRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/requirements', requirementsRoutes);

// ── Owner-side Routes ────────────────────────────────────────────
const ownerAuthRoutes = require('./routes/ownerAuthRoutes');
const pgRoutes = require('./routes/pgRoutes');
const roomRoutes = require('./routes/roomRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

app.use('/api/owner/auth', ownerAuthRoutes);
app.use('/api/pg', pgRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);

// ── Global Error Handler ─────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

// For Vercel Serverless Functions, we export the Express app instead of app.listen()
module.exports = app;

