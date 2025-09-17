const express = require('express');
const jwt = require('jsonwebtoken');
const Delivery = require('../models/Delivery');

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader // use the token directly
  if (!token) return res.status(401).json({ message: 'Access token required' })

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' })
    req.userId = user.userId
    next()
  })
}

// GET /deliveries - Fetch deliveries for authenticated consumer
router.get('/deliveries', authenticateToken, async (req, res) => {
  try {
    // Fetch all deliveries, sorted by creation date
    const deliveries = await Delivery.find().sort({ createdAt: -1 });

    // Map for formatting if needed
    const formattedDeliveries = deliveries.map(delivery => ({
      id: delivery._id,
      orderId: delivery.orderId,
      customerName: delivery.customerName,
      customerPhone: delivery.customerPhone,
      supplierName: delivery.supplierName,
      driverId: delivery.driverId,
      origin: delivery.origin,
      destination: delivery.destination,
      currentStatus: delivery.currentStatus,
      estimatedDelivery: delivery.estimatedDelivery,
      totalDistance: delivery.totalDistance,
      checkpoints: delivery.checkpoints,
      remainingTime: delivery.remainingTime,
      statusHistory: delivery.statusHistory,
      createdAt: delivery.createdAt,
      updatedAt: delivery.updatedAt
    }));

    res.json(formattedDeliveries);
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    res.status(500).json({ error: "Failed to fetch deliveries" });
  }
});

module.exports = router;
