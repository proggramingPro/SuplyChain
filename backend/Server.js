// backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

// Import routes

const shipmentRoutes = require("./routes/Shipmentroutes");
const Delivery = require("./models/Delivery");
const Driver = require("./models/Driver");


const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/supplychain")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Create HTTP + Socket.io server
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || "http://localhost:3000" },
});

// Attach io to req for broadcasting updates in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Register routes

app.use("/api/shipments", shipmentRoutes);

// Minimal current-shipment endpoint to satisfy frontend calls
app.get("/api/drivers/:driverId/current-shipment", async (req, res) => {
  try {
    const { driverId } = req.params;

    // Find the latest active delivery (not delivered) for this driver
    let delivery = await Delivery.findOne({
      driverId,
      currentStatus: { $ne: "delivered" },
    })
      .sort({ updatedAt: -1, _id: -1 })
      .lean();

    // If no delivery found, create a test one for demo
    if (!delivery) {
      // Create different test deliveries for different drivers
      const testDeliveries = {
        "DRIVER001": {
          customerName: "John Doe",
          customerPhone: "+91 98765 43210",
          supplierName: "TechMart Supply",
          orderId: "ORD-2024-001",
          origin: { name: "TechMart Warehouse, Mumbai", lat: 19.076, lng: 72.8777 },
          destination: { name: "John's Office, Pune", lat: 18.5204, lng: 73.8567 },
          checkpoints: [
            { id: "cp-1", name: "Warehouse Pickup", location: { lat: 19.076, lng: 72.8777, address: "TechMart Warehouse, Mumbai" }, status: "pending", order: 0, estimatedArrival: new Date(Date.now() + 30 * 60 * 1000) },
            { id: "cp-2", name: "Distribution Center", location: { lat: 18.9891, lng: 72.8950, address: "Mumbai Distribution Center" }, status: "pending", order: 1, estimatedArrival: new Date(Date.now() + 90 * 60 * 1000) },
            { id: "cp-3", name: "Customer Location", location: { lat: 18.5204, lng: 73.8567, address: "John's Office, Pune" }, status: "pending", order: 2, estimatedArrival: new Date(Date.now() + 150 * 60 * 1000) }
          ]
        },
        "DRIVER002": {
          customerName: "Sarah Johnson",
          customerPhone: "+91 98765 43211",
          supplierName: "QuickMart Supply",
          orderId: "ORD-2024-002",
          origin: { name: "QuickMart Warehouse, Delhi", lat: 28.6139, lng: 77.2090 },
          destination: { name: "Sarah's Home, Gurgaon", lat: 28.4595, lng: 77.0266 },
          checkpoints: [
            { id: "cp-1", name: "Warehouse Pickup", location: { lat: 28.6139, lng: 77.2090, address: "QuickMart Warehouse, Delhi" }, status: "pending", order: 0, estimatedArrival: new Date(Date.now() + 30 * 60 * 1000) },
            { id: "cp-2", name: "Distribution Center", location: { lat: 28.5355, lng: 77.3910, address: "Delhi Distribution Center" }, status: "pending", order: 1, estimatedArrival: new Date(Date.now() + 60 * 60 * 1000) },
            { id: "cp-3", name: "Customer Location", location: { lat: 28.4595, lng: 77.0266, address: "Sarah's Home, Gurgaon" }, status: "pending", order: 2, estimatedArrival: new Date(Date.now() + 120 * 60 * 1000) }
          ]
        },
        "DRIVER003": {
          customerName: "Mike Wilson",
          customerPhone: "+91 98765 43212",
          supplierName: "FastTrack Supply",
          orderId: "ORD-2024-003",
          origin: { name: "FastTrack Warehouse, Bangalore", lat: 12.9716, lng: 77.5946 },
          destination: { name: "Mike's Office, Whitefield", lat: 12.9698, lng: 77.7500 },
          checkpoints: [
            { id: "cp-1", name: "Warehouse Pickup", location: { lat: 12.9716, lng: 77.5946, address: "FastTrack Warehouse, Bangalore" }, status: "pending", order: 0, estimatedArrival: new Date(Date.now() + 30 * 60 * 1000) },
            { id: "cp-2", name: "Distribution Center", location: { lat: 12.9141, lng: 77.6786, address: "Bangalore Distribution Center" }, status: "pending", order: 1, estimatedArrival: new Date(Date.now() + 75 * 60 * 1000) },
            { id: "cp-3", name: "Customer Location", location: { lat: 12.9698, lng: 77.7500, address: "Mike's Office, Whitefield" }, status: "pending", order: 2, estimatedArrival: new Date(Date.now() + 135 * 60 * 1000) }
          ]
        }
      };

      const testData = testDeliveries[driverId] || testDeliveries["DRIVER001"];
      
      delivery = new Delivery({
        driverId,
        customerName: testData.customerName,
        customerPhone: testData.customerPhone,
        supplierName: testData.supplierName,
        orderId: testData.orderId,
        origin: testData.origin,
        destination: testData.destination,
        estimatedDelivery: new Date(Date.now() + 2.5 * 60 * 60 * 1000),
        totalDistance: 148,
        currentStatus: "pending",
        checkpoints: testData.checkpoints,
        remainingTime: 150
      });
      await delivery.save();
    }

    return res.json(delivery);
  } catch (err) {
    console.error("current-shipment error:", err);
    return res.status(500).json({ error: "Failed to fetch current shipment" });
  }
});

// Quick action: Build navigation URL for client to open
app.get("/api/driver/navigation", (req, res) => {
  try {
    const { fromLat, fromLng, toLat, toLng, mode = "driving" } = req.query;
    if (!fromLat || !fromLng || !toLat || !toLng) {
      return res.status(400).json({ error: "Missing coordinates" });
    }

    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      `${fromLat},${fromLng}`
    )}&destination=${encodeURIComponent(`${toLat},${toLng}`)}&travelmode=${encodeURIComponent(
      mode
    )}`;

    res.json({ url });
  } catch (err) {
    console.error("Navigation endpoint error:", err);
    res.status(500).json({ error: "Failed to build navigation URL" });
  }
});

// Quick action: Emergency trigger (lightweight version)
app.post("/api/emergency", (req, res) => {
  try {
    const { driverId, location, message } = req.body || {};
    console.log("🚨 Emergency:", { driverId, location, message });

    // Broadcast emergency to connected clients if desired
    try {
      io.emit("emergency-alert", {
        driverId,
        location,
        message,
        timestamp: new Date(),
      });
    } catch (_) {}

    res.json({ status: "ok", message: "Emergency alert triggered" });
  } catch (err) {
    console.error("Emergency endpoint error:", err);
    res.status(500).json({ error: "Failed to trigger emergency" });
  }
});

// Location update to support live tracking
app.post("/api/drivers/:driverId/location", async (req, res) => {
  try {
    const { driverId } = req.params;
    const { latitude, longitude, address } = req.body || {};
    const lastUpdated = new Date();

    // Update driver location in database
    await Driver.findOneAndUpdate(
      { driverId },
      {
        $set: {
          'currentLocation.latitude': latitude,
          'currentLocation.longitude': longitude,
          'currentLocation.lastUpdated': lastUpdated,
          'currentLocation.address': address,
          status: 'online'
        }
      },
      { upsert: true, new: true }
    );

    // Broadcast location update
    try {
      io.emit("driver-location-update", {
        driverId,
        location: { latitude, longitude, lastUpdated, address },
      });
    } catch (wsError) {
      console.warn("WebSocket broadcast failed:", wsError.message);
    }

    res.json({
      success: true,
      message: "Location updated",
      driverId,
      location: { latitude, longitude, lastUpdated, address },
    });
  } catch (err) {
    console.error("Location update error:", err);
    res.status(500).json({ error: "Failed to update location" });
  }
});

// Get driver location from database
app.get("/api/drivers/:driverId/location", async (req, res) => {
  try {
    const { driverId } = req.params;
    
    const driver = await Driver.findOne({ driverId }).select('currentLocation status');
    
    if (!driver || !driver.currentLocation.latitude) {
      return res.status(404).json({ error: "Driver location not found" });
    }

    res.json({
      driverId,
      location: driver.currentLocation,
      status: driver.status
    });
  } catch (err) {
    console.error("Get driver location error:", err);
    res.status(500).json({ error: "Failed to get driver location" });
  }
});

// Route directions endpoint
app.post("/api/route/directions", (req, res) => {
  try {
    const { coordinates } = req.body;
    
    if (!coordinates || coordinates.length < 2) {
      return res.status(400).json({ error: "At least 2 coordinates required" });
    }

    // For now, return a simple route with intermediate points
    // In production, integrate with Google Maps API, OpenRouteService, or similar
    const [start, end] = coordinates;
    const route = {
      coordinates: [
        start, // [lng, lat]
        [start[0] + (end[0] - start[0]) * 0.3, start[1] + (end[1] - start[1]) * 0.3], // 30% along
        [start[0] + (end[0] - start[0]) * 0.7, start[1] + (end[1] - start[1]) * 0.7], // 70% along
        end
      ],
      distance: 148, // km
      duration: 9000, // seconds
      summary: "Route from origin to destination"
    };

    res.json(route);
  } catch (err) {
    console.error("Route directions error:", err);
    res.status(500).json({ error: "Failed to get route directions" });
  }
});

// Checkpoint management endpoints
app.post("/api/deliveries/:deliveryId/checkpoints", async (req, res) => {
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
          status: "pending"
        })),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    res.json(delivery);
  } catch (err) {
    console.error("Checkpoints update error:", err);
    res.status(500).json({ error: "Failed to update checkpoints" });
  }
});

app.put("/api/deliveries/:deliveryId/checkpoints/:checkpointId", async (req, res) => {
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
    
    if (status === "arrived") {
      checkpoint.actualArrival = new Date();
    }

    delivery.updatedAt = new Date();
    await delivery.save();

    res.json(delivery);
  } catch (err) {
    console.error("Checkpoint update error:", err);
    res.status(500).json({ error: "Failed to update checkpoint" });
  }
});

// Calculate remaining time
app.get("/api/deliveries/:deliveryId/remaining-time", async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { currentLat, currentLng } = req.query;

    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    // Find next pending checkpoint
    const nextCheckpoint = delivery.checkpoints.find(cp => cp.status === "pending");
    if (!nextCheckpoint) {
      return res.json({ remainingTime: 0, message: "All checkpoints completed" });
    }

    // Simple distance calculation (in production, use proper routing)
    const distance = Math.sqrt(
      Math.pow(currentLat - nextCheckpoint.location.lat, 2) + 
      Math.pow(currentLng - nextCheckpoint.location.lng, 2)
    ) * 111; // rough km conversion

    const estimatedTime = Math.round(distance * 2); // 2 minutes per km
    delivery.remainingTime = estimatedTime;
    await delivery.save();

    res.json({ 
      remainingTime: estimatedTime,
      nextCheckpoint: nextCheckpoint.name,
      distance: Math.round(distance * 10) / 10
    });
  } catch (err) {
    console.error("Remaining time calculation error:", err);
    res.status(500).json({ error: "Failed to calculate remaining time" });
  }
});

// Geocoding endpoint - convert address to coordinates
app.get("/api/geocode", async (req, res) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }

    // Using OpenStreetMap Nominatim (free geocoding service)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    );
    
    if (!response.ok) {
      throw new Error("Geocoding service unavailable");
    }
    
    const data = await response.json();
    
    if (data.length === 0) {
      return res.status(404).json({ error: "Address not found" });
    }
    
    const result = data[0];
    res.json({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      address: result.display_name,
      formatted: {
        name: result.name || address,
        address: result.display_name
      }
    });
  } catch (err) {
    console.error("Geocoding error:", err);
    res.status(500).json({ error: "Failed to geocode address" });
  }
});

// Get all deliveries/shipments
app.get("/api/deliveries", async (req, res) => {
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
      createdAt: delivery.createdAt,
      updatedAt: delivery.updatedAt
    }));
    
    res.json(formattedDeliveries);
  } catch (err) {
    console.error("Get deliveries error:", err);
    res.status(500).json({ error: "Failed to fetch deliveries" });
  }
});

// Create new delivery
app.post("/api/deliveries", async (req, res) => {
  try {
    const deliveryData = req.body;
    
    // Assign a driver (in production, use proper driver assignment logic)
    deliveryData.driverId = deliveryData.driverId || "DRIVER001";
    
    const delivery = new Delivery(deliveryData);
    await delivery.save();

    // Notify driver via WebSocket
    try {
      io.emit("new-delivery-assignment", {
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

    res.status(201).json(delivery);
  } catch (err) {
    console.error("Create delivery error:", err);
    res.status(500).json({ error: "Failed to create delivery" });
  }
});

// Update delivery status
app.post("/api/deliveries/:deliveryId/status", async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { status } = req.body;
    
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
      updatedBy: "driver"
    });
    
    await delivery.save();
    
    // Notify supplier via WebSocket
    try {
      io.emit("delivery-status-update", {
        deliveryId: delivery._id,
        status: status,
        timestamp: new Date(),
        customerName: delivery.customerName,
        driverId: delivery.driverId
      });
    } catch (wsError) {
      console.error("WebSocket notification failed:", wsError);
    }
    
    console.log(`Delivery ${deliveryId} status updated to: ${status}`);
    res.json({ 
      success: true, 
      currentStatus: status,
      deliveryId: delivery._id,
      message: `Status updated to ${status}`
    });
  } catch (err) {
    console.error("Update delivery status error:", err);
    res.status(500).json({ error: "Failed to update delivery status" });
  }
});

// Get all drivers
app.get("/api/drivers", async (req, res) => {
  try {
    let drivers = await Driver.find({}).select('driverId name phone email licenseNumber loginId password status stats createdAt updatedAt');
    
    // If no drivers exist, create some default ones
    if (drivers.length === 0) {
      console.log("No drivers found, creating default drivers...");
      
      const defaultDrivers = [
        {
          driverId: "DRIVER001",
          name: "John Smith",
          phone: "+91 98765 43210",
          email: "john@example.com",
          licenseNumber: "DL123456789",
          loginId: "DRIVER001",
          password: "DRIVER001",
          status: "online",
          stats: {
            totalDeliveries: 156,
            rating: 4.8,
            onTimeRate: 94,
            weeklyDeliveries: 12,
            weeklyEarnings: 2850
          }
        },
        {
          driverId: "DRIVER002",
          name: "Sarah Johnson",
          phone: "+91 98765 43211",
          email: "sarah@example.com",
          licenseNumber: "DL123456790",
          loginId: "DRIVER002",
          password: "DRIVER002",
          status: "offline",
          stats: {
            totalDeliveries: 203,
            rating: 4.9,
            onTimeRate: 96,
            weeklyDeliveries: 15,
            weeklyEarnings: 3200
          }
        },
        {
          driverId: "DRIVER003",
          name: "Mike Wilson",
          phone: "+91 98765 43212",
          email: "mike@example.com",
          licenseNumber: "DL123456791",
          loginId: "DRIVER003",
          password: "DRIVER003",
          status: "online",
          stats: {
            totalDeliveries: 189,
            rating: 4.7,
            onTimeRate: 92,
            weeklyDeliveries: 14,
            weeklyEarnings: 2950
          }
        }
      ];
      
      // Create default drivers in database
      for (const driverData of defaultDrivers) {
        const driver = new Driver({
          ...driverData,
          currentLocation: {
            latitude: null,
            longitude: null,
            address: null,
            lastUpdated: null
          }
        });
        await driver.save();
      }
      
      // Fetch the newly created drivers
      drivers = await Driver.find({}).select('driverId name phone email licenseNumber loginId password status stats createdAt updatedAt');
    }
    
    console.log('Raw drivers from database:', drivers);
    
    const formattedDrivers = drivers.map(driver => {
      console.log('Processing driver:', driver);
      return {
        id: driver.driverId,
        driverId: driver.driverId,
        name: driver.name || 'Unknown Driver',
        phone: driver.phone || 'N/A',
        email: driver.email || 'N/A',
        licenseNumber: driver.licenseNumber || 'N/A',
        loginId: driver.loginId || driver.driverId,
        password: driver.password || driver.driverId,
        status: driver.status || 'offline',
        stats: driver.stats || { totalDeliveries: 0, rating: 5.0, onTimeRate: 100, weeklyDeliveries: 0, weeklyEarnings: 0 },
        createdAt: driver.createdAt,
        updatedAt: driver.updatedAt
      };
    });
    
    console.log(`Returning ${formattedDrivers.length} drivers:`, formattedDrivers.map(d => d.name));
    res.json(formattedDrivers);
  } catch (err) {
    console.error("Get drivers error:", err);
    res.status(500).json({ error: "Failed to fetch drivers" });
  }
});

// Create new driver
app.post("/api/drivers", async (req, res) => {
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
      loginId: driverData.loginId || driverId, // Use driverId as loginId if not provided
      password: driverId, // Always set password as driverId
      status: driverData.status || "offline",
      stats: driverData.stats || {
        totalDeliveries: 0,
        rating: 5.0,
        onTimeRate: 100,
        weeklyDeliveries: 0,
        weeklyEarnings: 0
      },
      currentLocation: {
        latitude: null,
        longitude: null,
        address: null,
        lastUpdated: null
      }
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
      createdAt: driver.createdAt,
      updatedAt: driver.updatedAt
    });
  } catch (err) {
    console.error("Create driver error:", err);
    res.status(500).json({ error: "Failed to create driver" });
  }
});

// Delete driver endpoint
app.delete("/api/drivers/:driverId", async (req, res) => {
  try {
    const { driverId } = req.params;
    
    console.log(`Deleting driver: ${driverId}`);
    
    const driver = await Driver.findOneAndDelete({ driverId });
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }
    
    // Also remove any active deliveries for this driver
    await Delivery.updateMany(
      { driverId },
      { $unset: { driverId: 1 }, currentStatus: "unassigned" }
    );
    
    console.log(`Driver ${driverId} deleted successfully`);
    res.json({ 
      success: true, 
      message: `Driver ${driverId} deleted successfully`,
      deletedDriver: {
        driverId: driver.driverId,
        name: driver.name
      }
    });
  } catch (err) {
    console.error("Delete driver error:", err);
    res.status(500).json({ error: "Failed to delete driver" });
  }
});

// Photo upload endpoint
app.post("/api/delivery-photos", async (req, res) => {
  try {
    // For now, just return success - in production, handle file upload
    const { shipmentId, timestamp } = req.body;
    
    console.log(`Photo uploaded for shipment ${shipmentId} at ${timestamp}`);
    
    res.json({
      success: true,
      message: "Photo uploaded successfully",
      photoUrl: `/uploads/delivery-${shipmentId}-${Date.now()}.jpg`,
      timestamp: new Date()
    });
  } catch (err) {
    console.error("Photo upload error:", err);
    res.status(500).json({ error: "Failed to upload photo" });
  }
});

// Notifications endpoint
app.post("/api/notifications", async (req, res) => {
  try {
    const { shipmentId, type, message, timestamp } = req.body;
    
    console.log(`Notification sent: ${type} for shipment ${shipmentId}: ${message}`);
    
    // Broadcast notification to connected clients
    try {
      io.emit("delivery-notification", {
        shipmentId,
        type,
        message,
        timestamp: new Date()
      });
    } catch (wsError) {
      console.warn("WebSocket notification broadcast failed:", wsError.message);
    }
    
    res.json({
      success: true,
      message: "Notification sent successfully",
      notificationId: `notif-${Date.now()}`,
      timestamp: new Date()
    });
  } catch (err) {
    console.error("Notification error:", err);
    res.status(500).json({ error: "Failed to send notification" });
  }
});


// WebSocket connections
io.on("connection", (socket) => {
  console.log("🔗 Client connected:", socket.id);

  socket.on("track-shipment", (shipmentId) => {
    socket.join(`shipment-${shipmentId}`);
    console.log(`📦 Tracking shipment: ${shipmentId}`);
  });

  socket.on("stop-tracking", (shipmentId) => {
    socket.leave(`shipment-${shipmentId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", uptime: process.uptime(), timestamp: new Date() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Supply Chain Server running on port ${PORT}`);
});

module.exports = app;
