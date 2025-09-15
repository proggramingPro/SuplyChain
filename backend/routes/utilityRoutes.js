const express = require('express');
const router = express.Router();

/**
 * @route   GET /api/utils (root handler for geocoding)
 * @desc    Handles geocoding requests at the root level for backward compatibility
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({ 
        error: "Address parameter is required.",
        availableEndpoints: ["/geocode", "/navigation", "/directions", "/emergency", "/delivery-photos", "/notifications"]
      });
    }

    // Handle geocoding at root level
    const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Geocoding service responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Address could not be found." });
    }
    
    const result = data[0];
    res.json({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      address: result.display_name,
      formatted: {
        name: result.name || result.display_name.split(',')[0].trim(),
        address: result.display_name
      }
    });
  } catch (err) {
    console.error("Geocoding error:", err.message);
    res.status(500).json({ error: "Failed to geocode address." });
  }
});

/**
 * @route   GET /api/utils/navigation
 * @desc    Builds a Google Maps navigation URL for client-side redirection.
 * @access  Public
 */
router.get("/navigation", (req, res) => {
  try {
    const { fromLat, fromLng, toLat, toLng, mode = "driving" } = req.query;
    if (!fromLat || !fromLng || !toLat || !toLng) {
      return res.status(400).json({ error: "Missing required coordinates (fromLat, fromLng, toLat, toLng)." });
    }

    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      `${fromLat},${fromLng}`
    )}&destination=${encodeURIComponent(`${toLat},${toLng}`)}&travelmode=${encodeURIComponent(
      mode
    )}`;

    res.json({ url });
  } catch (err) {
    console.error("Navigation endpoint error:", err);
    res.status(500).json({ error: "Failed to build navigation URL." });
  }
});

/**
 * @route   POST /api/utils/emergency
 * @desc    Triggers an emergency alert via WebSocket to all connected clients.
 * @access  Public
 */
router.post("/emergency", (req, res) => {
  try {
    const { driverId, location, message, severity = "high" } = req.body || {};
    
    if (!driverId) {
      return res.status(400).json({ error: "driverId is required for emergency alerts." });
    }

    console.log("🚨 Emergency Alert Triggered:", { driverId, location, message, severity });

    // Use the attached io instance to broadcast the alert
    req.io.emit("emergency-alert", {
      driverId,
      location,
      message: message || "Emergency situation reported",
      severity,
      timestamp: new Date(),
      alertId: `emergency-${driverId}-${Date.now()}`
    });

    res.json({ 
      success: true,
      status: "ok", 
      message: "Emergency alert has been broadcast.",
      alertId: `emergency-${driverId}-${Date.now()}`,
      timestamp: new Date()
    });
  } catch (err) {
    console.error("Emergency endpoint error:", err);
    res.status(500).json({ error: "Failed to trigger emergency alert." });
  }
});

/**
 * @route   POST /api/utils/directions
 * @desc    Calculates a route between a set of coordinates (mock implementation).
 * @access  Public
 */
router.post("/route/directions", (req, res) => {
  try {
    const { coordinates, mode = "driving" } = req.body;
    
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 2) {
      return res.status(400).json({ error: "An array with at least 2 coordinate pairs is required." });
    }

    // This is a placeholder for a real routing engine integration (e.g., Google Maps Directions API).
    const [start, end] = coordinates;
    
    // Calculate rough distance using Haversine formula
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    const R = 6371000; // Earth's radius in meters
    const lat1Rad = toRadians(start[1]);
    const lat2Rad = toRadians(end[1]);
    const deltaLatRad = toRadians(end[1] - start[1]);
    const deltaLngRad = toRadians(end[0] - start[0]);

    const a = Math.sin(deltaLatRad/2) * Math.sin(deltaLatRad/2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(deltaLngRad/2) * Math.sin(deltaLngRad/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    // Estimate duration based on mode
    const speedKmh = mode === "walking" ? 5 : mode === "bicycling" ? 20 : 50;
    const duration = Math.round((distance / 1000) / speedKmh * 3600); // in seconds

    const mockRoute = {
      coordinates: [
        start, // [lng, lat]
        [start[0] + (end[0] - start[0]) * 0.3, start[1] + (end[1] - start[1]) * 0.3],
        [start[0] + (end[0] - start[0]) * 0.7, start[1] + (end[1] - start[1]) * 0.7],
        end
      ],
      distance: Math.round(distance), // in meters
      duration: duration,   // in seconds
      summary: `Mock ${mode} route from origin to destination`,
      mode: mode
    };

    res.json(mockRoute);
  } catch (err) {
    console.error("Route directions error:", err);
    res.status(500).json({ error: "Failed to get route directions" });
  }
});

/**
 * @route   GET /api/utils/geocode
 * @desc    Converts a physical address into geographic coordinates (lat/lng).
 * @access  Public
 */
router.get("/geocode", async (req, res) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({ error: "Address is a required query parameter." });
    }

    // Using OpenStreetMap Nominatim API. Be mindful of usage policies in production.
    const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Geocoding service responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Address could not be found." });
    }
    
    const result = data[0];
    res.json({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      address: result.display_name,
      formatted: {
        name: result.name || result.display_name.split(',')[0].trim(),
        address: result.display_name
      },
      boundingBox: result.boundingbox
    });
  } catch (err) {
    console.error("Geocoding error:", err.message);
    res.status(500).json({ error: "Failed to geocode address." });
  }
});

/**
 * @route   GET /api/utils/reverse-geocode
 * @desc    Converts geographic coordinates into a physical address.
 * @access  Public
 */
router.get("/reverse-geocode", async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: "Both lat and lng query parameters are required." });
    }

    const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Reverse geocoding service responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.display_name) {
      return res.status(404).json({ error: "Location could not be found." });
    }
    
    res.json({
      address: data.display_name,
      components: data.address || {},
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lon),
      formatted: {
        name: data.name || data.display_name.split(',')[0].trim(),
        address: data.display_name
      }
    });
  } catch (err) {
    console.error("Reverse geocoding error:", err.message);
    res.status(500).json({ error: "Failed to reverse geocode coordinates." });
  }
});

/**
 * @route   POST /api/utils/delivery-photos
 * @desc    Handles mock photo upload for a delivery. In production, this would use multer.
 * @access  Public
 */
router.post("/delivery-photos", async (req, res) => {
  try {
    const { shipmentId, timestamp, driverId } = req.body;
    
    if (!shipmentId) {
      return res.status(400).json({ error: "A shipmentId is required." });
    }
    
    console.log(`📸 Mock photo uploaded for shipment ${shipmentId} by driver ${driverId || 'unknown'} at ${timestamp || new Date()}`);
    
    // In a real app, you would process the file and save it to cloud storage (S3, etc.)
    const photoUrl = `/uploads/delivery-${shipmentId}-${Date.now()}.jpg`;
    
    // Broadcast photo upload notification
    if (req.io) {
      req.io.emit("delivery-photo-uploaded", {
        shipmentId,
        driverId,
        photoUrl,
        timestamp: new Date()
      });
    }
    
    res.json({
      success: true,
      message: "Photo uploaded successfully (mock response)",
      photoUrl: photoUrl,
      timestamp: new Date(),
      uploadId: `photo-${shipmentId}-${Date.now()}`
    });
  } catch (err) {
    console.error("Photo upload error:", err);
    res.status(500).json({ error: "Failed to upload photo." });
  }
});

/**
 * @route   POST /api/utils/notifications
 * @desc    Sends a generic notification via WebSocket
 * @access  Public
 */
router.post("/notifications", async (req, res) => {
  try {
    const { shipmentId, type, message, recipient, priority = "normal" } = req.body;
    
    if (!type || !message) {
      return res.status(400).json({ error: "Fields 'type' and 'message' are required." });
    }
    
    const notificationId = `notif-${Date.now()}`;
    
    console.log(`🔔 Notification Sent: ${type} for shipment ${shipmentId || 'N/A'}: ${message}`);
    
    const notificationData = {
      id: notificationId,
      shipmentId,
      type,
      message,
      recipient,
      priority,
      timestamp: new Date(),
      read: false
    };
    
    // Broadcast notification to all connected clients or specific recipient
    if (recipient) {
      req.io.to(recipient).emit("delivery-notification", notificationData);
    } else {
      req.io.emit("delivery-notification", notificationData);
    }
    
    res.json({
      success: true,
      message: "Notification sent successfully.",
      notificationId: notificationId,
      timestamp: new Date(),
      recipient: recipient || "all"
    });
  } catch (err) {
    console.error("Notification error:", err);
    res.status(500).json({ error: "Failed to send notification." });
  }
});

/**
 * @route   POST /api/utils/broadcast
 * @desc    Broadcasts a message to all connected clients
 * @access  Public
 */
router.post("/broadcast", (req, res) => {
  try {
    const { event, data, room } = req.body;
    
    if (!event) {
      return res.status(400).json({ error: "Event name is required." });
    }
    
    const broadcastData = {
      ...data,
      timestamp: new Date(),
      broadcastId: `broadcast-${Date.now()}`
    };
    
    // Broadcast to specific room or all clients
    if (room) {
      req.io.to(room).emit(event, broadcastData);
    } else {
      req.io.emit(event, broadcastData);
    }
    
    console.log(`📡 Broadcast sent: ${event} to ${room || 'all clients'}`);
    
    res.json({
      success: true,
      message: `Event '${event}' broadcasted successfully`,
      broadcastId: broadcastData.broadcastId,
      timestamp: broadcastData.timestamp,
      room: room || "all"
    });
  } catch (err) {
    console.error("Broadcast error:", err);
    res.status(500).json({ error: "Failed to broadcast message." });
  }
});

/**
 * @route   GET /api/utils/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version
  });
});

/**
 * @route   GET /api/utils/endpoints
 * @desc    Lists all available utility endpoints
 * @access  Public
 */
router.get("/endpoints", (req, res) => {
  const endpoints = [
    { method: "GET", path: "/", description: "Root geocoding endpoint" },
    { method: "GET", path: "/geocode", description: "Convert address to coordinates" },
    { method: "GET", path: "/reverse-geocode", description: "Convert coordinates to address" },
    { method: "GET", path: "/navigation", description: "Get Google Maps navigation URL" },
    { method: "POST", path: "/directions", description: "Calculate route between coordinates" },
    { method: "POST", path: "/emergency", description: "Trigger emergency alert" },
    { method: "POST", path: "/delivery-photos", description: "Upload delivery photos" },
    { method: "POST", path: "/notifications", description: "Send notifications via WebSocket" },
    { method: "POST", path: "/broadcast", description: "Broadcast events to clients" },
    { method: "GET", path: "/health", description: "Service health check" },
    { method: "GET", path: "/endpoints", description: "List all available endpoints" }
  ];
  
  res.json({
    service: "Utility Routes API",
    version: "1.0.0",
    endpoints: endpoints,
    timestamp: new Date()
  });
});

module.exports = router;