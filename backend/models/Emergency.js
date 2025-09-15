const mongoose = require('mongoose');

const EmergencySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  driverId: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  message: { type: String, required: true },
  status: { type: String, enum: ['active', 'resolved'], default: 'active' },
  timestamp: { type: Date, default: Date.now },
  resolvedAt: Date,
  resolvedBy: String
});