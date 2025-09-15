// routes/ShipmentRoutes.js
const express = require('express');
const router = express.Router();
const Delivery = require('../models/Delivery');
const Driver = require('../models/Driver');

// Get all deliveries/shipments
router.get('/', async (req, res) => {
  try {
    const deliveries = await Delivery.find({}).sort({ createdAt: -1 });
    
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
    console.error("Get deliveries error:", error);
    res.status(500).json({ error: "Failed to fetch deliveries" });
  }
});

// Get single shipment by ID
router.get('/:shipmentId', async (req, res) => {
  try {
    const { shipmentId } = req.params;
    
    const delivery = await Delivery.findById(shipmentId);
    if (!delivery) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    res.json({
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
      currentLocation: delivery.currentLocation,
      deliveryNotes: delivery.deliveryNotes,
      deliveryPhoto: delivery.deliveryPhoto,
      createdAt: delivery.createdAt,
      updatedAt: delivery.updatedAt
    });
  } catch (error) {
    console.error("Get shipment error:", error);
    res.status(500).json({ error: "Failed to fetch shipment" });
  }
});

// Create new delivery/shipment
router.post('/', async (req, res) => {
  try {
    const deliveryData = req.body;
    
    // Generate automatic order ID if not provided
    if (!deliveryData.orderId) {
      const deliveryCount = await Delivery.countDocuments();
      deliveryData.orderId = `ORD${String(deliveryCount + 1).padStart(6, '0')}`;
    }

    // Assign a driver if not provided (in production, use proper driver assignment logic)
    if (!deliveryData.driverId) {
      const availableDriver = await Driver.findOne({ 
        status: { $in: ['active', 'online'] } 
      }).sort({ 'stats.totalDeliveries': 1 }); // Assign to driver with least deliveries
      
      if (availableDriver) {
        deliveryData.driverId = availableDriver.driverId;
      }
    }
    
    const delivery = new Delivery({
      ...deliveryData,
      currentStatus: deliveryData.currentStatus || 'pending',
      statusHistory: [{
        status: deliveryData.currentStatus || 'pending',
        timestamp: new Date(),
        updatedBy: 'system'
      }]
    });
    
    await delivery.save();

    // Notify assigned driver via WebSocket
    if (deliveryData.driverId && req.io) {
      try {
        req.io.emit("new-delivery-assignment", {
          deliveryId: delivery._id,
          driverId: deliveryData.driverId,
          customerName: deliveryData.customerName,
          destination: deliveryData.destination,
          priority: deliveryData.priority,
          timestamp: new Date()
        });
      } catch (wsError) {
        console.error("WebSocket notification failed:", wsError);
      }
    }

    res.status(201).json(delivery);
  } catch (error) {
    console.error("Create delivery error:", error);
    res.status(500).json({ error: "Failed to create delivery" });
  }
});

// Update delivery/shipment status
router.post('/:deliveryId/status', async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { status, notes } = req.body;
    
    console.log(`Updating delivery ${deliveryId} status to: ${status}`);
    
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }
    
    // Update the status
    delivery.currentStatus = status;
    delivery.updatedAt = new Date();
    
    // Add status history
    if (!delivery.statusHistory) {
      delivery.statusHistory = [];
    }
    delivery.statusHistory.push({
      status: status,
      timestamp: new Date(),
      updatedBy: "driver",
      notes: notes
    });
    
    await delivery.save();
    
    // Notify supplier and other stakeholders via WebSocket
    if (req.io) {
      try {
        req.io.emit("delivery-status-update", {
          deliveryId: delivery._id,
          status: status,
          timestamp: new Date(),
          customerName: delivery.customerName,
          driverId: delivery.driverId,
          notes: notes
        });

        // Also emit to specific shipment room
        req.io.to(`shipment-${deliveryId}`).emit('shipment-update', {
          type: 'status_update',
          shipmentId: deliveryId,
          status: status,
          timestamp: new Date(),
          notes: notes
        });
      } catch (wsError) {
        console.error("WebSocket notification failed:", wsError);
      }
    }
    
    console.log(`Delivery ${deliveryId} status updated to: ${status}`);
    res.json({ 
      success: true, 
      currentStatus: status,
      deliveryId: delivery._id,
      message: `Status updated to ${status}`,
      delivery: delivery
    });
  } catch (error) {
    console.error("Update delivery status error:", error);
    res.status(500).json({ error: "Failed to update delivery status" });
  }
});

// Update entire shipment
router.put('/:shipmentId', async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const updateData = req.body;
    
    // Add updatedAt timestamp
    updateData.updatedAt = new Date();
    
    const delivery = await Delivery.findByIdAndUpdate(
      shipmentId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!delivery) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    // Broadcast update via WebSocket
    if (req.io) {
      req.io.to(`shipment-${shipmentId}`).emit('shipment-update', {
        type: 'shipment_updated',
        shipmentId,
        shipment: delivery,
        timestamp: new Date()
      });
    }

    res.json(delivery);
  } catch (error) {
    console.error("Update shipment error:", error);
    res.status(500).json({ error: "Failed to update shipment" });
  }
});

// Delete shipment
router.delete('/:shipmentId', async (req, res) => {
  try {
    const { shipmentId } = req.params;
    
    const delivery = await Delivery.findByIdAndDelete(shipmentId);
    if (!delivery) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    // Broadcast deletion via WebSocket
    if (req.io) {
      req.io.emit('shipment-deleted', {
        shipmentId,
        timestamp: new Date()
      });
    }

    res.json({ 
      success: true, 
      message: "Shipment deleted successfully",
      deletedShipment: {
        id: delivery._id,
        orderId: delivery.orderId
      }
    });
  } catch (error) {
    console.error("Delete shipment error:", error);
    res.status(500).json({ error: "Failed to delete shipment" });
  }
});

// Checkpoint management - Add/Update checkpoints
router.post('/:deliveryId/checkpoints', async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { checkpoints } = req.body;

    const delivery = await Delivery.findByIdAndUpdate(
      deliveryId,
      { 
        checkpoints: checkpoints.map((cp, index) => ({
          ...cp,
          id: cp.id || `cp-${Date.now()}-${index}`,
          order: index,
          status: cp.status || "pending"
        })),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    // Broadcast checkpoint update
    if (req.io) {
      req.io.to(`shipment-${deliveryId}`).emit('shipment-update', {
        type: 'checkpoints_updated',
        shipmentId: deliveryId,
        checkpoints: delivery.checkpoints,
        timestamp: new Date()
      });
    }

    res.json(delivery);
  } catch (error) {
    console.error("Checkpoints update error:", error);
    res.status(500).json({ error: "Failed to update checkpoints" });
  }
});

// Update specific checkpoint
router.put('/:deliveryId/checkpoints/:checkpointId', async (req, res) => {
  try {
    const { deliveryId, checkpointId } = req.params;
    const { status, notes } = req.body;

    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    const checkpoint = delivery.checkpoints.find(cp => cp.id === checkpointId);
    if (!checkpoint) {
      return res.status(404).json({ error: "Checkpoint not found" });
    }

    checkpoint.status = status;
    checkpoint.notes = notes || checkpoint.notes;
    
    if (status === "arrived" || status === "completed") {
      checkpoint.actualArrival = new Date();
    }

    delivery.updatedAt = new Date();
    await delivery.save();

    // Broadcast checkpoint status change
    if (req.io) {
      req.io.to(`shipment-${deliveryId}`).emit('shipment-update', {
        type: 'checkpoint_status_changed',
        shipmentId: deliveryId,
        checkpointId,
        status,
        timestamp: new Date()
      });
    }

    res.json(delivery);
  } catch (error) {
    console.error("Checkpoint update error:", error);
    res.status(500).json({ error: "Failed to update checkpoint" });
  }
});

// Calculate remaining time for delivery
router.get('/:deliveryId/remaining-time', async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { currentLat, currentLng } = req.query;

    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    // Find next pending checkpoint
    const nextCheckpoint = delivery.checkpoints?.find(cp => cp.status === "pending");
    if (!nextCheckpoint) {
      return res.json({ 
        remainingTime: 0, 
        message: "All checkpoints completed",
        nextCheckpoint: null,
        distance: 0
      });
    }

    if (!currentLat || !currentLng) {
      return res.json({
        remainingTime: delivery.remainingTime || 0,
        nextCheckpoint: nextCheckpoint.name,
        message: "Current location required for accurate calculation"
      });
    }

    // Simple distance calculation (in production, use proper routing API)
    const distance = Math.sqrt(
      Math.pow(parseFloat(currentLat) - nextCheckpoint.location.lat, 2) + 
      Math.pow(parseFloat(currentLng) - nextCheckpoint.location.lng, 2)
    ) * 111; // rough km conversion

    const estimatedTime = Math.round(distance * 2); // 2 minutes per km
    
    // Update delivery with calculated remaining time
    delivery.remainingTime = estimatedTime;
    await delivery.save();

    res.json({ 
      remainingTime: estimatedTime,
      nextCheckpoint: nextCheckpoint.name,
      distance: Math.round(distance * 10) / 10,
      deliveryId: deliveryId
    });
  } catch (error) {
    console.error("Remaining time calculation error:", error);
    res.status(500).json({ error: "Failed to calculate remaining time" });
  }
});

// Get shipments by status
router.get('/status/:status', async (req, res) => {
  try {
    const { status } = req.params;
    const { limit = 50 } = req.query;

    const deliveries = await Delivery.find({ currentStatus: status })
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit));

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
      remainingTime: delivery.remainingTime,
      createdAt: delivery.createdAt,
      updatedAt: delivery.updatedAt
    }));

    res.json(formattedDeliveries);
  } catch (error) {
    console.error("Get deliveries by status error:", error);
    res.status(500).json({ error: "Failed to fetch deliveries by status" });
  }
});

// Get shipments by driver
router.get('/driver/:driverId', async (req, res) => {
  try {
    const { driverId } = req.params;
    const { status, limit = 20 } = req.query;

    let filter = { driverId };
    if (status) {
      filter.currentStatus = status;
    }

    const deliveries = await Delivery.find(filter)
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit));

    res.json(deliveries);
  } catch (error) {
    console.error("Get deliveries by driver error:", error);
    res.status(500).json({ error: "Failed to fetch driver deliveries" });
  }
});

// Assign driver to shipment
router.post('/:shipmentId/assign-driver', async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const { driverId } = req.body;

    const delivery = await Delivery.findById(shipmentId);
    if (!delivery) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    const driver = await Driver.findOne({ driverId });
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    // Update delivery with driver assignment
    delivery.driverId = driverId;
    delivery.currentStatus = 'assigned';
    delivery.updatedAt = new Date();
    
    // Add to status history
    delivery.statusHistory.push({
      status: 'assigned',
      timestamp: new Date(),
      updatedBy: 'system',
      notes: `Assigned to driver ${driver.name}`
    });

    await delivery.save();

    // Notify driver via WebSocket
    if (req.io) {
      req.io.emit("new-delivery-assignment", {
        deliveryId: delivery._id,
        driverId: driverId,
        customerName: delivery.customerName,
        destination: delivery.destination,
        timestamp: new Date()
      });

      req.io.to(`shipment-${shipmentId}`).emit('shipment-update', {
        type: 'driver_assigned',
        shipmentId,
        driverId,
        driverName: driver.name,
        timestamp: new Date()
      });
    }

    res.json({ 
      message: 'Driver assigned successfully', 
      delivery,
      driver: {
        driverId: driver.driverId,
        name: driver.name
      }
    });
  } catch (error) {
    console.error("Assign driver error:", error);
    res.status(500).json({ error: "Failed to assign driver" });
  }
});

// Get shipment tracking info
router.get('/:shipmentId/tracking', async (req, res) => {
  try {
    const { shipmentId } = req.params;

    const delivery = await Delivery.findById(shipmentId);
    if (!delivery) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    // Get driver info if assigned
    let driverInfo = null;
    if (delivery.driverId) {
      const driver = await Driver.findOne({ driverId: delivery.driverId })
        .select('driverId name phone currentLocation status');
      driverInfo = driver;
    }

    const trackingInfo = {
      shipmentId: delivery._id,
      orderId: delivery.orderId,
      currentStatus: delivery.currentStatus,
      statusHistory: delivery.statusHistory,
      currentLocation: delivery.currentLocation,
      origin: delivery.origin,
      destination: delivery.destination,
      estimatedDelivery: delivery.estimatedDelivery,
      checkpoints: delivery.checkpoints,
      remainingTime: delivery.remainingTime,
      driver: driverInfo,
      lastUpdated: delivery.updatedAt
    };

    res.json(trackingInfo);
  } catch (error) {
    console.error("Get tracking info error:", error);
    res.status(500).json({ error: "Failed to get tracking information" });
  }
});

// Search shipments
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { limit = 10 } = req.query;

    const searchRegex = new RegExp(query, 'i');
    
    const deliveries = await Delivery.find({
      $or: [
        { orderId: searchRegex },
        { customerName: searchRegex },
        { supplierName: searchRegex },
        { driverId: searchRegex }
      ]
    })
    .sort({ updatedAt: -1 })
    .limit(parseInt(limit));

    res.json(deliveries);
  } catch (error) {
    console.error("Search shipments error:", error);
    res.status(500).json({ error: "Failed to search shipments" });
  }
});

module.exports = router;