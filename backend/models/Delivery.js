// backend/models/Delivery.js
const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema({
  supplierId: String,
  driverId: String,
  consumerId: String,
  customerName: { type: String, default: "Customer" },
  customerPhone: { type: String, default: "+91 98765 43210" },
  supplierName: { type: String, default: "Supplier" },
  orderId: { type: String, default: "ORD-001" },
  origin: {
    name: { type: String, default: "Warehouse A, Mumbai" },
    lat: { type: Number, default: 19.076 },
    lng: { type: Number, default: 72.8777 }
  },
  destination: {
    name: { type: String, default: "Customer Location, Pune" },
    lat: { type: Number, default: 18.5204 },
    lng: { type: Number, default: 73.8567 }
  },
  estimatedDelivery: { type: Date, default: () => new Date(Date.now() + 2.5 * 60 * 60 * 1000) }, // 2.5 hours from now
  totalDistance: { type: Number, default: 148 },
  currentStatus: {
    type: String,
    enum: ["pending", "picked_up", "departed", "delivered"],
    default: "pending",
  },
  statusHistory: [
    {
      status: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  checkpoints: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: String
    },
    status: { 
      type: String, 
      enum: ["pending", "arrived", "departed", "skipped"], 
      default: "pending" 
    },
    estimatedArrival: Date,
    actualArrival: Date,
    notes: String,
    order: { type: Number, required: true }
  }],
  remainingTime: { type: Number, default: 0 }, // minutes
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Delivery", DeliverySchema);
