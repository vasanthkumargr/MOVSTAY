const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: String, required: true },
  rating: { type: Number, required: true },
  gender: { type: String, required: true },
  amenities: [{ type: String }],
  image: { type: String, required: true },
});

module.exports = mongoose.model('Hostel', hostelSchema, 'pglistings');
