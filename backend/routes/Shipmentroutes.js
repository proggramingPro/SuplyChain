// backend/routes/deliveryRoutes.js
const express = require("express");
const router = express.Router();
const Delivery = require("../models/Delivery");

// Update delivery status
router.post("/:deliveryId/status", async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { status } = req.body;

    const delivery = await Delivery.findByIdAndUpdate(
      deliveryId,
      {
        currentStatus: status,
        $push: { statusHistory: { status, timestamp: new Date() } },
      },
      { new: true }
    );

    if (!delivery) return res.status(404).json({ message: "Delivery not found" });

    // 🔔 Emit event for dashboards if Socket.io is enabled
    req.io?.emit("deliveryUpdate", delivery);

    res.json(delivery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
