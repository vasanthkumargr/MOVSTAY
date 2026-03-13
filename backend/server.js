require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL, // Set this in Render env vars to your Vercel URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, curl)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express.json());

// ── Student-side Routes ──────────────────────────────────────────
const hostelRoutes = require('./routes/hostels');
const authRoutes = require('./routes/auth');          // OTP-based auth
const bookingRoutes = require('./routes/bookings');
const requirementsRoutes = require('./routes/requirements');

app.use('/api/hostels', hostelRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/requirements', requirementsRoutes);

// ── Owner-side Routes ────────────────────────────────────────────
const ownerAuthRoutes = require('./routes/ownerAuthRoutes');  // JWT-based auth
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

// ── MongoDB Connection ───────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB (mov_stay)');
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Error connecting to MongoDB:', err.message);
    });
