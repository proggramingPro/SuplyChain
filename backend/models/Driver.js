const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  driverId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  licenseNumber: {
    type: String,
    required: true
  },
  loginId: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'busy'],
    default: 'offline'
  },
  currentLocation: {
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    },
    lastUpdated: {
      type: Date,
      default: null
    },
    address: {
      type: String,
      default: null
    }
  },
  vehicleInfo: {
    type: {
      type: String,
      default: 'truck'
    },
    licensePlate: {
      type: String,
      default: null
    },
    capacity: {
      type: Number,
      default: 1000 // kg
    }
  },
  stats: {
    totalDeliveries: {
      type: Number,
      default: 0
    },
    onTimeRate: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0
    },
    totalDistance: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
driverSchema.index({ driverId: 1 });
driverSchema.index({ status: 1 });
driverSchema.index({ 'currentLocation.latitude': 1, 'currentLocation.longitude': 1 });

module.exports = mongoose.model('Driver', driverSchema);


