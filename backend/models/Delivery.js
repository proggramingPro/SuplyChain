// backend/models/Delivery.js
const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema({
  supplierId: { type: String, required: true },
  driverId: { type: String, required: true },
  consumerId: { type: String, required: true },
  customerName: { type: String },
  customerPhone: { type: String },
  supplierName: { type: String },
  orderId: { type: String, required: true },
  origin: {
    name: { type: String },
    lat: { type: Number },
    lng: { type: Number }
  },
  destination: {
    name: { type: String },
    lat: { type: Number },
    lng: { type: Number }
  },
  estimatedDelivery: { type: Date },
  totalDistance: { type: Number },
  currentStatus: {
    type: String,
    enum: ["pending", "picked_up", "departed", "delivered"],
    default: "pending"
  },
  statusHistory: [
    {
      status: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  checkpoints: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        address: { type: String }
      },
      status: {
        type: String,
        enum: ["pending", "arrived", "departed", "skipped"],
        default: "pending"
      },
      estimatedArrival: { type: Date },
      actualArrival: { type: Date },
      notes: { type: String },
      order: { type: Number, required: true }
    }
  ],
  remainingTime: { type: Number }, // minutes
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Delivery", DeliverySchema);
