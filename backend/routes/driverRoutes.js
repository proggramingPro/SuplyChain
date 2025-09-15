// routes/driverRoutes.js
const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const Delivery = require('../models/Delivery');
const Emergency = require('../models/Emergency');

// Helper function to calculate distance between coordinates
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
}

// Helper function to broadcast shipment updates
async function broadcastShipmentUpdate(shipmentId, updateData, io) {
  if (io) {
    io.to(`shipment-${shipmentId}`).emit('shipment-update', updateData);
  }
}

// Get driver's current shipment
router.get('/:driverId/current-shipment', async (req, res) => {
  try {
    const { driverId } = req.params;

    // Find the latest active delivery (not delivered) for this driver
    let delivery = await Delivery.findOne({
      driverId,
      currentStatus: { $ne: "delivered" },
    })
      .sort({ updatedAt: -1, _id: -1 })
      .lean();

    res.json(delivery);
  } catch (error) {
    console.error("Get current shipment error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update driver location
router.post('/:driverId/location', async (req, res) => {
  try {
    const { driverId } = req.params;
    const { latitude, longitude, address } = req.body || {};
    const lastUpdated = new Date();

    // Update driver location in database
    const driver = await Driver.findOneAndUpdate(
      { driverId },
      {
        $set: {
          'currentLocation.latitude': latitude,
          'currentLocation.longitude': longitude,
          'currentLocation.lastUpdated': lastUpdated,
          'currentLocation.address': address,
          status: 'online',
          updatedAt: lastUpdated
        }
      },
      { upsert: true, new: true }
    );

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    // Also update shipment location if driver has active delivery
    const activeDelivery = await Delivery.findOne({
      driverId,
      currentStatus: { $ne: "delivered" }
    });

    if (activeDelivery) {
      await Delivery.findByIdAndUpdate(
        activeDelivery._id,
        {
          currentLocation: {
            latitude,
            longitude,
            lastUpdated
          },
          updatedAt: lastUpdated
        }
      );

      // Broadcast location update
      await broadcastShipmentUpdate(activeDelivery._id.toString(), {
        type: 'location_update',
        shipmentId: activeDelivery._id,
        location: { latitude, longitude, lastUpdated },
        driverId
      }, req.io);
    }

    // Broadcast driver location update
    if (req.io) {
      req.io.emit("driver-location-update", {
        driverId,
        location: { latitude, longitude, lastUpdated, address },
      });
    }

    res.json({
      success: true,
      message: "Location updated",
      driverId,
      location: { latitude, longitude, lastUpdated, address },
    });
  } catch (error) {
    console.error("Location update error:", error);
    res.status(500).json({ error: error.message });
  }
});


// Get driver statistics
router.get('/:driverId/stats', async (req, res) => {
  try {
    const driver = await Driver.findOne({ driverId: req.params.driverId });
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    // Calculate additional stats from deliveries
    const driverDeliveries = await Delivery.find({ driverId: req.params.driverId });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayDeliveries = driverDeliveries.filter(d => 
      d.updatedAt && new Date(d.updatedAt) >= today && d.currentStatus === 'delivered'
    ).length;

    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());
    
    const weeklyDeliveries = driverDeliveries.filter(d => 
      d.updatedAt && new Date(d.updatedAt) >= thisWeekStart && d.currentStatus === 'delivered'
    ).length;

    const stats = {
      ...driver.stats.toObject(),
      todayDeliveries,
      weeklyDeliveries,
      totalActiveShipments: driverDeliveries.filter(d => 
        d.currentStatus === 'in_transit' || d.currentStatus === 'assigned'
      ).length
    };

    res.json(stats);
  } catch (error) {
    console.error("Get driver stats error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get driver's delivery history
router.get('/:driverId/deliveries', async (req, res) => {
  try {
    const { limit = 10, status } = req.query;
    
    let filter = { driverId: req.params.driverId };

    if (status) {
      filter.currentStatus = status;
    }

    const deliveries = await Delivery.find(filter)
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit));

    // Format for frontend
    const formattedDeliveries = deliveries.map(delivery => ({
      id: delivery._id,
      orderId: delivery.orderId,
      customer: delivery.customerName || 'Customer',
      status: delivery.currentStatus,
      time: delivery.updatedAt ? 
        `${Math.round((Date.now() - new Date(delivery.updatedAt)) / (1000 * 60 * 60))} hours ago` :
        'Recent',
      rating: delivery.rating || 5,
      origin: delivery.origin?.name || delivery.origin?.address,
      destination: delivery.destination?.name || delivery.destination?.address
    }));

    res.json(formattedDeliveries);
  } catch (error) {
    console.error("Get driver deliveries error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Assign delivery to driver
router.post('/:driverId/assign-shipment', async (req, res) => {
  try {
    const { shipmentId } = req.body;
    
    const driver = await Driver.findOne({ driverId: req.params.driverId });
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    const delivery = await Delivery.findById(shipmentId);
    if (!delivery) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    // Update driver status to busy (as per schema enum)
    driver.status = 'busy';
    await driver.save();

    // Update delivery with driver info
    delivery.driverId = req.params.driverId;
    delivery.currentStatus = 'assigned';
    delivery.updatedAt = new Date();
    await delivery.save();

    res.json({ message: 'Shipment assigned successfully', delivery, driver });
  } catch (error) {
    console.error("Assign shipment error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Complete delivery
router.post('/:driverId/complete-delivery', async (req, res) => {
  try {
    const { shipmentId, notes, photoUrl } = req.body;
    
    const driver = await Driver.findOne({ driverId: req.params.driverId });
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    const delivery = await Delivery.findByIdAndUpdate(
      shipmentId,
      {
        currentStatus: 'delivered',
        deliveryNotes: notes,
        deliveryPhoto: photoUrl,
        updatedAt: new Date(),
        $push: { 
          statusHistory: { 
            status: 'delivered', 
            timestamp: new Date(),
            updatedBy: req.params.driverId
          } 
        }
      },
      { new: true }
    );

    if (!delivery) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    // Update driver stats
    driver.stats.totalDeliveries += 1;
    driver.stats.totalDistance += delivery.totalDistance || 0;
    driver.status = 'online'; // Available for new assignment
    await driver.save();

    // Broadcast completion
    await broadcastShipmentUpdate(shipmentId, {
      type: 'delivery_completed',
      shipmentId,
      driverId: req.params.driverId,
      completedAt: new Date()
    }, req.io);

    res.json({ message: 'Delivery completed successfully', delivery });
  } catch (error) {
    console.error("Complete delivery error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get available drivers
router.get('/', async (req, res) => {
  try {
    const { status = 'online', nearby } = req.query;
    
    let drivers = await Driver.find({ isActive: true }).select('driverId name phone email licenseNumber loginId password status stats createdAt updatedAt currentLocation vehicleInfo');
    
    // Filter by status if specified
    if (status && status !== 'all') {
      drivers = drivers.filter(driver => driver.status === status);
    }
    
    // If nearby location is provided, filter by proximity
    if (nearby) {
      const [lat, lng, radius = 50] = nearby.split(',').map(Number);
      
      drivers = drivers.filter(driver => {
        if (!driver.currentLocation || !driver.currentLocation.latitude) return false;
        
        const distance = calculateDistance(
          lat, lng,
          driver.currentLocation.latitude,
          driver.currentLocation.longitude
        );
        
        return distance <= radius;
      });
    }

    const formattedDrivers = drivers.map(driver => ({
      id: driver.driverId,
      driverId: driver.driverId,
      name: driver.name || 'Unknown Driver',
      phone: driver.phone || 'N/A',
      email: driver.email || 'N/A',
      licenseNumber: driver.licenseNumber || 'N/A',
      loginId: driver.loginId || driver.driverId,
      password: driver.password || driver.driverId,
      status: driver.status || 'offline',
      stats: driver.stats || { totalDeliveries: 0, rating: 0, onTimeRate: 0, totalDistance: 0 },
      currentLocation: driver.currentLocation,
      vehicleInfo: driver.vehicleInfo,
      createdAt: driver.createdAt,
      updatedAt: driver.updatedAt
    }));
    
    res.json(formattedDrivers);
  } catch (error) {
    console.error("Get drivers error:", error);
    res.status(500).json({ error: "Failed to fetch drivers" });
  }
});

// Create new driver
router.post('/', async (req, res) => {
  try {
    const driverData = req.body;
    
    // Generate automatic driver ID
    const driverCount = await Driver.countDocuments();
    const driverId = `DRIVER${String(driverCount + 1).padStart(3, '0')}`;
    
    // Create driver document in database
    const driver = new Driver({
      driverId: driverId,
      name: driverData.name,
      phone: driverData.phone,
      email: driverData.email,
      licenseNumber: driverData.licenseNumber,
      loginId: driverData.loginId || driverId,
      password: driverId,
      status: driverData.status || "offline",
      stats: driverData.stats || {
        totalDeliveries: 0,
        rating: 0,
        onTimeRate: 0,
        totalDistance: 0
      },
      currentLocation: {
        latitude: null,
        longitude: null,
        address: null,
        lastUpdated: null
      },
      vehicleInfo: {
        type: driverData.vehicleInfo?.type || 'truck',
        licensePlate: driverData.vehicleInfo?.licensePlate || null,
        capacity: driverData.vehicleInfo?.capacity || 1000
      },
      isActive: true
    });

    await driver.save();
    
    res.status(201).json({
      id: driverId,
      driverId: driverId,
      name: driver.name,
      phone: driver.phone,
      email: driver.email,
      licenseNumber: driver.licenseNumber,
      loginId: driver.loginId,
      password: driver.password,
      status: driver.status,
      stats: driver.stats,
      vehicleInfo: driver.vehicleInfo,
      createdAt: driver.createdAt,
      updatedAt: driver.updatedAt
    });
  } catch (error) {
    console.error("Create driver error:", error);
    res.status(500).json({ error: "Failed to create driver" });
  }
});

// Delete driver (soft delete by setting isActive to false)
router.delete('/:driverId', async (req, res) => {
  try {
    const { driverId } = req.params;
    
    const driver = await Driver.findOneAndUpdate(
      { driverId },
      { isActive: false, status: 'offline', updatedAt: new Date() },
      { new: true }
    );
    
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }
    
    // Also remove any active deliveries for this driver
    await Delivery.updateMany(
      { driverId },
      { $unset: { driverId: 1 }, currentStatus: "unassigned" }
    );
    
    res.json({ 
      success: true, 
      message: `Driver ${driverId} deleted successfully`,
      deletedDriver: {
        driverId: driver.driverId,
        name: driver.name
      }
    });
  } catch (error) {
    console.error("Delete driver error:", error);
    res.status(500).json({ error: "Failed to delete driver" });
  }
});

// Update driver status
router.put('/:driverId/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status against schema enum
    const validStatuses = ['online', 'offline', 'busy'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be one of: online, offline, busy' });
    }
    
    const driver = await Driver.findOneAndUpdate(
      { driverId: req.params.driverId },
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    // Broadcast status change
    if (req.io) {
      req.io.emit('driver-status-change', {
        driverId: req.params.driverId,
        status,
        timestamp: new Date()
      });
    }

    res.json(driver);
  } catch (error) {
    console.error("Update driver status error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Driver break management
router.post('/:driverId/break', async (req, res) => {
  try {
    const { action } = req.body; // 'start' or 'end'
    
    const newStatus = action === 'start' ? 'offline' : 'online'; // Using schema enum values
    
    const driver = await Driver.findOneAndUpdate(
      { driverId: req.params.driverId },
      { status: newStatus, updatedAt: new Date() },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    res.json({ 
      message: `Break ${action}ed successfully`, 
      status: newStatus,
      timestamp: new Date()
    });
  } catch (error) {
    console.error("Driver break management error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get nearby drivers for dispatch
router.post('/nearby', async (req, res) => {
  try {
    const { latitude, longitude, radius = 50, status = 'online' } = req.body;
    
    const drivers = await Driver.find({ status, isActive: true });
    
    const nearbyDrivers = drivers
      .filter(driver => {
        if (!driver.currentLocation || !driver.currentLocation.latitude) return false;
        
        const distance = calculateDistance(
          latitude, longitude,
          driver.currentLocation.latitude,
          driver.currentLocation.longitude
        );
        
        return distance <= radius;
      })
      .map(driver => ({
        ...driver.toObject(),
        distance: calculateDistance(
          latitude, longitude,
          driver.currentLocation.latitude,
          driver.currentLocation.longitude
        )
      }))
      .sort((a, b) => a.distance - b.distance);

    res.json(nearbyDrivers);
  } catch (error) {
    console.error("Get nearby drivers error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get driver performance metrics
router.get('/:driverId/performance', async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    
    const driver = await Driver.findOne({ driverId: req.params.driverId });
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const deliveries = await Delivery.find({
      driverId: req.params.driverId,
      createdAt: { $gte: startDate }
    });

    const performance = {
      totalShipments: deliveries.length,
      completedShipments: deliveries.filter(d => d.currentStatus === 'delivered').length,
      onTimeDeliveries: deliveries.filter(d => 
        d.currentStatus === 'delivered' && 
        d.updatedAt && 
        d.estimatedDelivery &&
        new Date(d.updatedAt) <= new Date(d.estimatedDelivery)
      ).length,
      totalDistance: driver.stats.totalDistance,
      averageRating: driver.stats.rating,
      vehicleInfo: driver.vehicleInfo
    };

    performance.onTimeRate = performance.completedShipments > 0 ? 
      Math.round((performance.onTimeDeliveries / performance.completedShipments) * 100) : 0;
    
    performance.completionRate = performance.totalShipments > 0 ?
      Math.round((performance.completedShipments / performance.totalShipments) * 100) : 0;

    res.json(performance);
  } catch (error) {
    console.error("Get driver performance error:", error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;