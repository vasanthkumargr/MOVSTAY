const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false, // Optional: Google-auth or OTP-auth users won't have a password initially
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  googleId: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ["student", "owner", "admin"],
    default: "student",
  },
  phone: String,
  profileImage: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
