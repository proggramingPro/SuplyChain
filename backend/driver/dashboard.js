// backend/routes/dashboard.js
const express = require('express');
const router = express.Router();

// Mock database - replace with your actual database queries
const mockData = {
  drivers: {
    'DRIVER001': {
      id: 'DRIVER001',
      name: 'John Doe',
      currentLocation: {
        lat: 19.0760,
        lng: 72.8777,
        address: 'Mumbai, Maharashtra',
        timestamp: new Date()
      },
      isTracking: true,
      stats: {
        rating: 4.8,
        totalDeliveries: 156,
        onTimeRate: 94,
        todayDeliveries: 3,
        weeklyEarnings: 2850,
        weeklyDeliveries: 23,
        weeklyDistance: 1247
      },
      currentDelivery: {
        id: 'DEL-2024-001',
        orderId: 'PKG-789',
        status: 'in_transit',
        customerName: 'Rajesh Kumar',
        customerPhone: '+91 98765 43210',
        origin: {
          name: 'Warehouse A, Mumbai',
          lat: 19.0760,
          lng: 72.8777
        },
        destination: {
          name: 'Customer Location, Pune',
          lat: 18.5204,
          lng: 73.8567,
          address: '123 MG Road, Pune, Maharashtra'
        },
        estimatedDelivery: new Date(Date.now() + 2.5 * 60 * 60 * 1000), // 2.5 hours from now
        totalDistance: 148,
        route: [
          {
            id: 'CP001',
            checkpointId: 'CP001',
            name: 'Mumbai Toll Plaza',
            location: { lat: 19.1136, lng: 72.9081 },
            status: 'completed',
            estimatedArrival: new Date(Date.now() - 30 * 60 * 1000),
            actualArrival: new Date(Date.now() - 25 * 60 * 1000)
          },
          {
            id: 'CP002',
            checkpointId: 'CP002',
            name: 'Lonavala Rest Stop',
            location: { lat: 18.7537, lng: 73.4068 },
            status: 'current',
            estimatedArrival: new Date(Date.now() + 30 * 60 * 1000)
          },
          {
            id: 'CP003',
            checkpointId: 'CP003',
            name: 'Pune Entry Point',
            location: { lat: 18.5679, lng: 73.8157 },
            status: 'pending',
            estimatedArrival: new Date(Date.now() + 90 * 60 * 1000)
          }
        ]
      },
      recentDeliveries: [
        {
          id: 'DEL-2024-002',
          customer: 'Priya Sharma',
          status: 'delivered',
          rating: 5,
          completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'DEL-2024-003',
          customer: 'Amit Patel',
          status: 'delivered', 
          rating: 4,
          completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      ],
      alerts: [
        {
          type: 'traffic',
          severity: 'medium',
          message: 'Heavy traffic ahead on Mumbai-Pune Expressway. Consider alternate route.',
          timestamp: new Date()
        }
      ]
    }
  }
};

// Helper function to calculate delivery progress
function calculateDeliveryProgress(driver) {
  if (!driver.currentDelivery) return 0;
  
  const completedCheckpoints = driver.currentDelivery.route.filter(
    cp => cp.status === 'completed' || cp.status === 'departed'
  ).length;
  
  const totalCheckpoints = driver.currentDelivery.route.length;
  
  if (totalCheckpoints === 0) return 0;
  
  return Math.round((completedCheckpoints / totalCheckpoints) * 100);
}

// Get driver dashboard data
router.get('/:driverId', async (req, res) => {
  try {
    const { driverId } = req.params;
    
    // Get driver data (replace with actual database query)
    const driver = mockData.drivers[driverId];
    
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    // Calculate delivery progress
    const deliveryProgress = calculateDeliveryProgress(driver);
    
    // Prepare response
    const dashboardData = {
      currentDelivery: driver.currentDelivery,
      currentLocation: driver.currentLocation,
      driverStats: driver.stats,
      recentDeliveries: driver.recentDeliveries,
      alerts: driver.alerts,
      deliveryProgress: deliveryProgress,
      isTracking: driver.isTracking
    };
    
    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current location
router.get('/:driverId/location', async (req, res) => {
  try {
    const { driverId } = req.params;
    const driver = mockData.drivers[driverId];
    
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    // Simulate location updates (in real app, this would come from GPS/tracking system)
    const deliveryProgress = calculateDeliveryProgress(driver);
    
    res.json({
      currentLocation: driver.currentLocation,
      deliveryProgress: deliveryProgress,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start location tracking
router.post('/:driverId/tracking/start', async (req, res) => {
  try {
    const { driverId } = req.params;
    const driver = mockData.drivers[driverId];
    
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    // Update tracking status (in real app, start GPS tracking service)
    driver.isTracking = true;
    
    res.json({ 
      message: 'Location tracking started',
      isTracking: true 
    });
  } catch (error) {
    console.error('Error starting tracking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Stop location tracking
router.post('/:driverId/tracking/stop', async (req, res) => {
  try {
    const { driverId } = req.params;
    const driver = mockData.drivers[driverId];
    
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    // Update tracking status (in real app, stop GPS tracking service)
    driver.isTracking = false;
    
    res.json({ 
      message: 'Location tracking stopped',
      isTracking: false 
    });
  } catch (error) {
    console.error('Error stopping tracking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update delivery status
router.put('/:driverId/delivery/status', async (req, res) => {
  try {
    const { driverId } = req.params;
    const { deliveryId, status } = req.body;
    
    const driver = mockData.drivers[driverId];
    
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    if (!driver.currentDelivery || driver.currentDelivery.id !== deliveryId) {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    
    // Update delivery status
    driver.currentDelivery.status = status;
    driver.currentDelivery.statusUpdatedAt = new Date();
    
    // If delivered, move to recent deliveries
    if (status === 'delivered') {
      driver.recentDeliveries.unshift({
        id: driver.currentDelivery.id,
        customer: driver.currentDelivery.customerName,
        status: 'delivered',
        rating: 5, // Default rating
        completedAt: new Date()
      });
      
      // Update stats
      driver.stats.todayDeliveries += 1;
      driver.stats.totalDeliveries += 1;
      
      // Clear current delivery
      driver.currentDelivery = null;
    }
    
    res.json({
      message: `Delivery status updated to ${status}`,
      status: status,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update checkpoint status
router.put('/:driverId/checkpoint', async (req, res) => {
  try {
    const { driverId } = req.params;
    const { deliveryId, checkpointId, status, notes, timestamp } = req.body;
    
    const driver = mockData.drivers[driverId];
    
    if (!driver || !driver.currentDelivery) {
      return res.status(404).json({ error: 'Driver or delivery not found' });
    }
    
    // Find and update checkpoint
    const checkpoint = driver.currentDelivery.route.find(
      cp => cp.checkpointId === checkpointId || cp.id === checkpointId
    );
    
    if (!checkpoint) {
      return res.status(404).json({ error: 'Checkpoint not found' });
    }
    
    // Update checkpoint status
    checkpoint.status = status;
    checkpoint.actualArrival = new Date(timestamp);
    if (notes) checkpoint.notes = notes;
    
    // Update next checkpoint to current if this one is completed
    if (status === 'departed' || status === 'completed') {
      const currentIndex = driver.currentDelivery.route.findIndex(
        cp => cp.checkpointId === checkpointId || cp.id === checkpointId
      );
      
      if (currentIndex >= 0 && currentIndex < driver.currentDelivery.route.length - 1) {
        driver.currentDelivery.route[currentIndex + 1].status = 'current';
      }
    }
    
    res.json({
      message: 'Checkpoint updated successfully',
      checkpoint: checkpoint
    });
  } catch (error) {
    console.error('Error updating checkpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload delivery photo
router.post('/:driverId/photo', async (req, res) => {
  try {
    const { driverId } = req.params;
    
    // In a real app, you'd handle file upload using multer or similar
    // and store the file in cloud storage (AWS S3, etc.)
    
    const driver = mockData.drivers[driverId];
    
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    // Simulate photo upload
    const photoUrl = `https://example.com/photos/${driverId}_${Date.now()}.jpg`;
    
    // Add photo to delivery record
    if (driver.currentDelivery) {
      if (!driver.currentDelivery.photos) {
        driver.currentDelivery.photos = [];
      }
      driver.currentDelivery.photos.push({
        url: photoUrl,
        uploadedAt: new Date(),
        type: 'delivery_proof'
      });
    }
    
    res.json({
      message: 'Photo uploaded successfully',
      photoUrl: photoUrl
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Trigger emergency alert
router.post('/:driverId/emergency', async (req, res) => {
  try {
    const { driverId } = req.params;
    const { message, location, timestamp } = req.body;
    
    const driver = mockData.drivers[driverId];
    
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    // Create emergency alert
    const emergencyAlert = {
      id: `EMRG_${Date.now()}`,
      driverId: driverId,
      message: message,
      location: location,
      timestamp: new Date(timestamp),
      status: 'active',
      severity: 'high'
    };
    
    // Add to driver alerts
    driver.alerts.unshift({
      type: 'emergency',
      severity: 'high',
      message: 'Emergency alert has been sent to dispatch',
      timestamp: new Date()
    });
    
    // In real app, this would trigger notifications to dispatch, emergency services, etc.
    console.log('EMERGENCY ALERT:', emergencyAlert);
    
    res.json({
      message: 'Emergency alert sent successfully',
      alertId: emergencyAlert.id,
      status: 'sent'
    });
  } catch (error) {
    console.error('Error triggering emergency:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get navigation data
router.get('/:driverId/navigation', async (req, res) => {
  try {
    const { driverId } = req.params;
    const driver = mockData.drivers[driverId];
    
    if (!driver || !driver.currentDelivery) {
      return res.status(404).json({ error: 'Driver or delivery not found' });
    }
    
    // Prepare navigation data
    const navigationData = {
      origin: driver.currentLocation,
      destination: driver.currentDelivery.destination,
      waypoints: driver.currentDelivery.route.filter(cp => cp.status === 'pending'),
      estimatedTime: driver.currentDelivery.estimatedDelivery,
      distance: driver.currentDelivery.totalDistance
    };
    
    res.json(navigationData);
  } catch (error) {
    console.error('Error getting navigation data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update driver location (called by GPS tracking)
router.post('/:driverId/location', async (req, res) => {
  try {
    const { driverId } = req.params;
    const { lat, lng, address } = req.body;
    
    const driver = mockData.drivers[driverId];
    
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    // Update driver location
    driver.currentLocation = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      address: address || driver.currentLocation.address,
      timestamp: new Date()
    };
    
    res.json({
      message: 'Location updated successfully',
      location: driver.currentLocation
    });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;