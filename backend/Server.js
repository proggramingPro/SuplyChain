// --- Environment & Dependencies ---
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

// --- Route Imports ---
const authRoutes = require('./routes/auth');
const shipmentRoutes = require("./routes/Shipmentroutes");
const driverRoutes = require("./routes/driverRoutes");
const utilityRoutes = require("./routes/utilityRoutes");

// --- Server Configuration ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;
const app = express();

// --- Core Middleware ---
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log(`✅ Connected to MongoDB in Nashik, Maharashtra.`);
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
    });

// --- HTTP + Socket.io Server Setup ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || "http://localhost:3000" },
});

// Middleware to attach io instance to every request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// --- API Route Registration ---
// 
console.log("-> Registering API routes...");
app.use('/api/auth', authRoutes);
app.use("/api/utils", utilityRoutes); // All utility routes are now handled here
app.use("/api/deliveries", shipmentRoutes);
app.use("/api/drivers", driverRoutes);

console.log("-> All routes registered.");

// --- WebSocket Connection Logic ---
io.on("connection", (socket) => {
  console.log(`🔗 WebSocket client connected: ${socket.id}`);

  socket.on("track-shipment", (shipmentId) => {
    socket.join(`shipment-${shipmentId}`);
    console.log(`📦 Client ${socket.id} is tracking shipment: ${shipmentId}`);
  });

  socket.on("stop-tracking", (shipmentId) => {
    socket.leave(`shipment-${shipmentId}`);
    console.log(`📦 Client ${socket.id} stopped tracking shipment: ${shipmentId}`);
  });

  socket.on("disconnect", () => {
    console.log(`❌ WebSocket client disconnected: ${socket.id}`);
  });
});

// --- Health Check Endpoint ---
app.get("/api/health", (req, res) => {
  res.json({ 
      status: "OK", 
      uptime: `${Math.floor(process.uptime())} seconds`, 
      serverTime: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) 
  });
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error("❌ Unhandled Error:", err.stack);
  res.status(500).json({ error: "Something went wrong on the server!" });
});

// --- Server Startup ---
server.listen(PORT, () => {
  console.log(`🚀 Supply Chain Server is live on http://localhost:${PORT}`);
  console.log(`🕒 Current Server Time: ${new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })}`);
});

module.exports = app;

