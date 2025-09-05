// routes/driverRoutes.js - Add these routes to your main server.js

// Driver Schema
const DriverSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  vehicleId: { type: String, required: true },
  currentLocation: {
    latitude: Number,
    longitude: Number,
    lastUpdated: { type: Date, default: Date.now }
  },
  status: { type: String, enum: ['active', 'inactive', 'on_break', 'emergency'], default: 'active' },
  currentShipmentId: { type: String, default: null },
  stats: {
    totalDeliveries: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0 },
    onTimeRate: { type: Number, default: 100 },
    weeklyDeliveries: { type: Number, default: 0 },
    weeklyDistance: { type: Number, default: 0 },
    weeklyEarnings: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

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

const Driver = mongoose.model('Driver', DriverSchema);
const Emergency = mongoose.model('Emergency', EmergencySchema);

// Driver-specific routes to add to your server.js

// Get driver's current shipment
app.get('/api/drivers/:driverId/current-shipment', async (req, res) => {
  try {
    const driver = await Driver.findOne({ id: req.params.driverId });
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    if (!driver.currentShipmentId) {
      return res.json(null);
    }

    const shipment = await Shipment.findOne({ id: driver.currentShipmentId })
      .populate('origin destination');
    
    if (!shipment) {
      // Clear invalid shipment ID
      driver.currentShipmentId = null;
      await driver.save();
      return res.json(null);
    }

    res.json(shipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update driver location
app.post('/api/drivers/:driverId/location', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    const driver = await Driver.findOneAndUpdate(
      { id: req.params.driverId },
      {
        currentLocation: {
          latitude,
          longitude,
          lastUpdated: new Date()
        },
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    // Also update shipment location if driver has active shipment
    if (driver.currentShipmentId) {
      await Shipment.findOneAndUpdate(
        { id: driver.currentShipmentId },
        {
          currentLocation: {
            latitude,
            longitude,
            lastUpdated: new Date()
          },
          updatedAt: new Date()
        }
      );

      // Broadcast location update
      await broadcastShipmentUpdate(driver.currentShipmentId, {
        type: 'location_update',
        shipmentId: driver.currentShipmentId,
        location: { latitude, longitude, lastUpdated: new Date() },
        driverId: req.params.driverId
      });
    }

    res.json({ message: 'Location updated successfully', location: driver.currentLocation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get driver statistics
app.get('/api/drivers/:driverId/stats', async (req, res) => {
  try {
    const driver = await Driver.findOne({ id: req.params.driverId });
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    // Calculate additional stats from shipments
    const driverShipments = await Shipment.find({
      $or: [
        { 'driverId': req.params.driverId },
        { 'assignedDriver': req.params.driverId }
      ]
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayDeliveries = driverShipments.filter(s => 
      s.actualDelivery && new Date(s.actualDelivery) >= today
    ).length;

    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());
    
    const weeklyDeliveries = driverShipments.filter(s => 
      s.actualDelivery && new Date(s.actualDelivery) >= thisWeekStart
    ).length;

    const stats = {
      ...driver.stats.toObject(),
      todayDeliveries,
      weeklyDeliveries,
      totalActiveShipments: driverShipments.filter(s => s.status === 'in_transit').length
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get driver's delivery history
app.get('/api/drivers/:driverId/deliveries', async (req, res) => {
  try {
    const { limit = 10, status } = req.query;
    
    let filter = {
      $or: [
        { 'driverId': req.params.driverId },
        { 'assignedDriver': req.params.driverId }
      ]
    };

    if (status) {
      filter.status = status;
    }

    const deliveries = await Shipment.find(filter)
      .populate('origin destination')
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit));

    // Format for frontend
    const formattedDeliveries = deliveries.map(delivery => ({
      id: delivery.id,
      orderId: delivery.orderId,
      customer: delivery.customerName || 'Customer',
      status: delivery.status,
      time: delivery.actualDelivery ? 
        `${Math.round((Date.now() - new Date(delivery.actualDelivery)) / (1000 * 60 * 60))} hours ago` :
        'In progress',
      rating: delivery.rating || 5,
      origin: delivery.origin?.name,
      destination: delivery.destination?.name
    }));

    res.json(formattedDeliveries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Assign shipment to driver
app.post('/api/drivers/:driverId/assign-shipment', async (req, res) => {
  try {
    const { shipmentId } = req.body;
    
    const driver = await Driver.findOne({ id: req.params.driverId });
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    const shipment = await Shipment.findOne({ id: shipmentId });
    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    // Update driver's current shipment
    driver.currentShipmentId = shipmentId;
    driver.status = 'active';
    await driver.save();

    // Update shipment with driver info
    shipment.assignedDriver = req.params.driverId;
    shipment.status = 'assigned';
    await shipment.save();

    res.json({ message: 'Shipment assigned successfully', shipment, driver });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Complete delivery
app.post('/api/drivers/:driverId/complete-delivery', async (req, res) => {
  try {
    const { shipmentId, notes, photoUrl } = req.body;
    
    const driver = await Driver.findOne({ id: req.params.driverId });
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    const shipment = await Shipment.findOneAndUpdate(
      { id: shipmentId },
      {
        status: 'delivered',
        actualDelivery: new Date(),
        deliveryNotes: notes,
        deliveryPhoto: photoUrl,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    // Update driver stats
    driver.stats.totalDeliveries += 1;
    driver.stats.weeklyDeliveries += 1;
    driver.currentShipmentId = null;
    driver.status = 'active'; // Available for new assignment
    await driver.save();

    // Broadcast completion
    await broadcastShipmentUpdate(shipmentId, {
      type: 'delivery_completed',
      shipmentId,
      driverId: req.params.driverId,
      completedAt: new Date()
    });

    res.json({ message: 'Delivery completed successfully', shipment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Emergency alert
app.post('/api/emergency', async (req, res) => {
  try {
    const { driverId, location, message } = req.body;
    
    const emergencyId = `EMG-${Date.now()}`;
    const emergency = new Emergency({
      id: emergencyId,
      driverId,
      location,
      message,
      timestamp: new Date()
    });

    await emergency.save();

    // Update driver status
    await Driver.findOneAndUpdate(
      { id: driverId },
      { status: 'emergency', updatedAt: new Date() }
    );

    // Broadcast emergency alert to all connected clients
    io.emit('emergency-alert', {
      emergencyId,
      driverId,
      location,
      message,
      timestamp: new Date()
    });

    res.json({ 
      message: 'Emergency alert triggered', 
      emergencyId,
      status: 'Emergency services notified'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload delivery photo
app.post('/api/delivery-photos', async (req, res) => {
  try {
    // In a real implementation, you'd use multer for file uploads
    // and store files in cloud storage (AWS S3, Google Cloud, etc.)
    
    const { shipmentId } = req.body;
    
    // Mock photo upload - replace with actual file upload logic
    const photoUrl = `https://your-storage.com/photos/${shipmentId}-${Date.now()}.jpg`;
    
    const shipment = await Shipment.findOneAndUpdate(
      { id: shipmentId },
      {
        deliveryPhoto: photoUrl,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    res.json({ 
      message: 'Photo uploaded successfully', 
      photoUrl,
      shipmentId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send notifications
app.post('/api/notifications', async (req, res) => {
  try {
    const { shipmentId, type, message } = req.body;
    
    // Broadcast notification to relevant parties
    io.emit('notification', {
      shipmentId,
      type,
      message,
      timestamp: new Date()
    });

    res.json({ message: 'Notification sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get available drivers
app.get('/api/drivers', async (req, res) => {
  try {
    const { status = 'active', nearby } = req.query;
    
    let filter = { status };
    
    const drivers = await Driver.find(filter);
    
    // If nearby location is provided, filter by proximity
    if (nearby) {
      const [lat, lng, radius = 50] = nearby.split(',').map(Number);
      
      const nearbyDrivers = drivers.filter(driver => {
        if (!driver.currentLocation) return false;
        
        const distance = calculateDistance(
          lat, lng,
          driver.currentLocation.latitude,
          driver.currentLocation.longitude
        );
        
        return distance <= radius;
      });
      
      res.json(nearbyDrivers);
    } else {
      res.json(drivers);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new driver
app.post('/api/drivers', async (req, res) => {
  try {
    const driver = new Driver(req.body);
    await driver.save();
    res.status(201).json(driver);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update driver status
app.put('/api/drivers/:driverId/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const driver = await Driver.findOneAndUpdate(
      { id: req.params.driverId },
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    // Broadcast status change
    io.emit('driver-status-change', {
      driverId: req.params.driverId,
      status,
      timestamp: new Date()
    });

    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get driver performance metrics
app.get('/api/drivers/:driverId/performance', async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    
    const driver = await Driver.findOne({ id: req.params.driverId });
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const shipments = await Shipment.find({
      assignedDriver: req.params.driverId,
      createdAt: { $gte: startDate }
    });

    const performance = {
      totalShipments: shipments.length,
      completedShipments: shipments.filter(s => s.status === 'delivered').length,
      onTimeDeliveries: shipments.filter(s => 
        s.status === 'delivered' && 
        s.actualDelivery && 
        s.estimatedDelivery &&
        new Date(s.actualDelivery) <= new Date(s.estimatedDelivery)
      ).length,
      totalDistance: shipments.reduce((total, s) => total + (s.totalDistance || 0), 0),
      averageRating: driver.stats.rating,
      earnings: driver.stats.weeklyEarnings * (parseInt(period) / 7)
    };

    performance.onTimeRate = performance.completedShipments > 0 ? 
      Math.round((performance.onTimeDeliveries / performance.completedShipments) * 100) : 100;
    
    performance.completionRate = performance.totalShipments > 0 ?
      Math.round((performance.completedShipments / performance.totalShipments) * 100) : 0;

    res.json(performance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all active emergencies
app.get('/api/emergencies', async (req, res) => {
  try {
    const { status = 'active' } = req.query;
    
    const emergencies = await Emergency.find({ status })
      .populate('driverId')
      .sort({ timestamp: -1 });

    res.json(emergencies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Resolve emergency
app.put('/api/emergencies/:emergencyId/resolve', async (req, res) => {
  try {
    const { resolvedBy, notes } = req.body;
    
    const emergency = await Emergency.findOneAndUpdate(
      { id: req.params.emergencyId },
      {
        status: 'resolved',
        resolvedAt: new Date(),
        resolvedBy,
        notes
      },
      { new: true }
    );

    if (!emergency) {
      return res.status(404).json({ error: 'Emergency not found' });
    }

    // Update driver status back to active
    await Driver.findOneAndUpdate(
      { id: emergency.driverId },
      { status: 'active', updatedAt: new Date() }
    );

    // Broadcast resolution
    io.emit('emergency-resolved', {
      emergencyId: req.params.emergencyId,
      driverId: emergency.driverId,
      resolvedBy,
      resolvedAt: new Date()
    });

    res.json({ message: 'Emergency resolved successfully', emergency });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Driver break management
app.post('/api/drivers/:driverId/break', async (req, res) => {
  try {
    const { action } = req.body; // 'start' or 'end'
    
    const newStatus = action === 'start' ? 'on_break' : 'active';
    
    const driver = await Driver.findOneAndUpdate(
      { id: req.params.driverId },
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
    res.status(500).json({ error: error.message });
  }
});

// Get nearby drivers for dispatch
app.post('/api/drivers/nearby', async (req, res) => {
  try {
    const { latitude, longitude, radius = 50, status = 'active' } = req.body;
    
    const drivers = await Driver.find({ status });
    
    const nearbyDrivers = drivers
      .filter(driver => {
        if (!driver.currentLocation) return false;
        
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
    res.status(500).json({ error: error.message });
  }
});