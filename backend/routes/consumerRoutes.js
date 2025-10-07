const express = require('express');
const jwt = require('jsonwebtoken');
const Delivery = require('../models/Delivery');
const User = require('../models/users');

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
    // Get user details first
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch deliveries created for this consumer (by name AND phone for exact match)
    const deliveries = await Delivery.find({
      $and: [
        { customerName: user.name },
        { customerPhone: user.mobile }
      ]
    }).sort({ createdAt: -1 });

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

// GET /stats - Get delivery statistics using aggregation
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get user details for matching
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const stats = await Delivery.aggregate([
      {
        $match: {
          $and: [
            { customerName: user.name },
            { customerPhone: user.mobile }
          ]
        }
      },
      {
        $facet: {
          activePackages: [
            { $match: { currentStatus: { $nin: ['delivered', 'Delivered'] } } },
            { $count: 'count' }
          ],
          deliveredThisMonth: [
            {
              $match: {
                currentStatus: { $in: ['delivered', 'Delivered'] },
                estimatedDelivery: {
                  $gte: startOfMonth,
                  $lte: endOfMonth
                }
              }
            },
            { $count: 'count' }
          ]
        }
      }
    ]);

    const result = {
      activePackages: stats[0].activePackages[0]?.count || 0,
      deliveredThisMonth: stats[0].deliveredThisMonth[0]?.count || 0
    };

    res.json(result);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

// GET /profile - Get consumer profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT /profile - Update consumer profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, mobile } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, email, mobile },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// GET /consumers - Get all consumers for supplier dropdown (no auth needed for supplier)
router.get('/consumers', async (req, res) => {
  try {
    const consumers = await User.find({ category: 'consumer' })
      .select('name email mobile')
      .sort({ name: 1 });
    res.json(consumers);
  } catch (error) {
    console.error('Error fetching consumers:', error);
    res.status(500).json({ error: 'Failed to fetch consumers' });
  }
});

module.exports = router;
