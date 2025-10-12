const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ status: 'Delay analysis service is working', timestamp: new Date().toISOString() });
});

// Analyze delivery delay with current location and destination
router.post('/analyze-delay', async (req, res) => {
  let isResponseSent = false;
  
  const timeout = setTimeout(() => {
    if (!isResponseSent && !res.headersSent) {
      isResponseSent = true;
      res.status(408).json({ error: 'Request timeout' });
    }
  }, 30000);

  try {
    const { currentLocation, destination, vehicleType, deliveryId } = req.body;

    if (!currentLocation || !destination) {
      clearTimeout(timeout);
      if (!isResponseSent) {
        isResponseSent = true;
        return res.status(400).json({ error: 'Current location and destination are required' });
      }
      return;
    }

    // Get weather data for current location
    const weatherData = await geminiService.getWeatherData(
      currentLocation.lat, 
      currentLocation.lng
    );

    // Get traffic data
    const trafficData = await geminiService.getTrafficData(
      currentLocation, 
      destination
    );

    // Calculate basic route info (you can enhance this with your existing routing)
    const distance = calculateDistance(
      currentLocation.lat, currentLocation.lng,
      destination.lat, destination.lng
    );
    
    const routeInfo = {
      distance: Math.round(distance),
      duration: Math.round(distance / 50 * 60) // Rough estimate: 50 km/h average
    };

    // Get Gemini analysis
    const delayAnalysis = await geminiService.computeDeliveryDelay({
      currentLocation,
      destination,
      weatherData,
      trafficData,
      routeInfo,
      vehicleType
    });

    clearTimeout(timeout);
    if (!isResponseSent) {
      isResponseSent = true;
      res.json({
        success: true,
        analysis: delayAnalysis,
        contextData: {
          weather: weatherData,
          traffic: trafficData,
          route: routeInfo
        },
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    clearTimeout(timeout);
    console.error('Delay analysis error:', error);
    if (!isResponseSent && !res.headersSent) {
      isResponseSent = true;
      res.status(500).json({ 
        error: 'Failed to analyze delivery delay',
        details: error.message 
      });
    }
  }
});

// Get real-time delay updates for active delivery
router.get('/delivery/:deliveryId/delay-status', async (req, res) => {
  try {
    const { deliveryId } = req.params;
    
    // Get delivery details from your database
    // This is a placeholder - replace with your actual delivery lookup
    const delivery = await getDeliveryById(deliveryId);
    
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    const delayAnalysis = await geminiService.computeDeliveryDelay({
      currentLocation: delivery.currentLocation,
      destination: delivery.destination,
      weatherData: await geminiService.getWeatherData(
        delivery.currentLocation.lat, 
        delivery.currentLocation.lng
      ),
      trafficData: await geminiService.getTrafficData(
        delivery.currentLocation, 
        delivery.destination
      ),
      routeInfo: delivery.routeInfo,
      vehicleType: delivery.vehicleType
    });

    if (!res.headersSent) {
      res.json({
        deliveryId,
        delayStatus: delayAnalysis,
        lastUpdated: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('Delay status error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to get delay status' });
    }
  }
});

// Helper functions
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

async function getDeliveryById(deliveryId) {
  // Placeholder - implement your actual database lookup
  // This should return delivery data with currentLocation, destination, etc.
  return null;
}

module.exports = router;