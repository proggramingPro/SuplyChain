// hooks/useDriverDashboard.js - Custom hook for driver dashboard functionality
import { useState, useEffect, useCallback, useRef } from "react";
import SupplyChainAPI, { api } from "../backend/lib/api";

export const useDriverDashboard = (driverId, { autoStartTracking = true } = {}) => {
  const [currentDelivery, setCurrentDelivery] = useState(null);
  const [driverStats, setDriverStats] = useState(null);
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [deliveryProgress, setDeliveryProgress] = useState(0);

  const locationWatchId = useRef(null);
  const socketCleanup = useRef(null);

  // Load current delivery/shipment
  const loadCurrentDelivery = useCallback(async () => {
    try {
      console.log(`Loading delivery for driver: ${driverId}`);
      const shipment = await SupplyChainAPI.getDriverCurrentShipment(driverId);
      console.log(`Loaded delivery:`, shipment);
      setCurrentDelivery(shipment);

      // Calculate delivery progress
      if (shipment && shipment.checkpoints) {
        const completedCheckpoints = shipment.checkpoints.filter(
          (cp) => cp.status === "departed" || cp.status === "arrived"
        ).length;
        const progress = (completedCheckpoints / shipment.checkpoints.length) * 100;
        setDeliveryProgress(Math.round(progress));
      }

      // Set up real-time tracking if shipment exists
      if (shipment && shipment.id) {
        socketCleanup.current = api.trackShipment(
          shipment.id,
          handleShipmentUpdate
        );
      }
    } catch (err) {
      console.error("Failed to load current delivery:", err);
      setError("Failed to load current delivery");
    }
  }, [driverId]);

  // Load driver location from database
  const loadDriverLocation = useCallback(async () => {
    try {
      console.log(`Loading location for driver: ${driverId}`);
      const response = await fetch(`http://localhost:5000/api/drivers/${driverId}/location`);
      if (response.ok) {
        const data = await response.json();
        console.log(`Loaded location:`, data);
        if (data.location && data.location.latitude) {
          setCurrentLocation({
            lat: data.location.latitude,
            lng: data.location.longitude,
            address: data.location.address,
            lastUpdated: data.location.lastUpdated
          });
        }
      } else {
        console.log(`No location found for driver ${driverId}`);
      }
    } catch (err) {
      console.error("Failed to load driver location:", err);
    }
  }, [driverId]);

  // Initialize data on mount
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          loadCurrentDelivery(),
          loadDriverLocation(),
          // loadDriverStats(),
          // loadRecentDeliveries(),
          autoStartTracking ? startLocationTracking() : Promise.resolve(),
        ]);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (driverId) {
      initializeDashboard();
    }

    // Listen for new delivery assignments
    const socket = api.initializeWebSocket();
    socket.on("new-delivery-assignment", (assignment) => {
      if (assignment.driverId === driverId) {
        setAlerts(prev => [...prev, {
          type: "assignment",
          message: `New delivery assigned: ${assignment.customerName} - ${assignment.destination.name}`,
          severity: "medium",
          timestamp: new Date(),
          deliveryId: assignment.deliveryId
        }]);
        
        // Refresh current delivery
        loadCurrentDelivery();
      }
    });

    return () => {
      stopLocationTracking();
      if (socketCleanup.current) {
        socketCleanup.current();
      }
      socket.off("new-delivery-assignment");
    };
  }, [driverId, autoStartTracking, loadCurrentDelivery, loadDriverLocation]);

  // Load driver statistics
  /*   const loadDriverStats = useCallback(async () => {
    try {
      const stats = await SupplyChainAPI.getDriverStats(driverId);
      setDriverStats(stats);
    } catch (err) {
      console.error('Failed to load driver stats:', err);
    }
  }, [driverId]);

  // Load recent deliveries
  const loadRecentDeliveries = useCallback(async () => {
    try {
      const deliveries = await SupplyChainAPI.getDriverDeliveryHistory(driverId);
      setRecentDeliveries(deliveries);
    } catch (err) {
      console.error('Failed to load recent deliveries:', err);
    }
  }, [driverId]); */

  // Start GPS location tracking
  const startLocationTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // 1 minute
    };

    locationWatchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(),
        };

        setCurrentLocation(newLocation);

        // Update location on server
        updateLocationOnServer(newLocation);
      },
      (error) => {
        console.error("Geolocation error:", {
          code: error.code,
          message: error.message,
        });
        setError(`Failed to get location: ${error.message}`);
      },
      options
    );

    setIsTracking(true);
  }, [isTracking]);

  // Stop location tracking
  const stopLocationTracking = useCallback(() => {
    if (locationWatchId.current) {
      navigator.geolocation.clearWatch(locationWatchId.current);
      locationWatchId.current = null;
    }
    setIsTracking(false);
  }, []);

  // Update location on server
  const updateLocationOnServer = useCallback(
    async (location) => {
      try {
        console.log(`Updating location for driver ${driverId}:`, location);
        await SupplyChainAPI.updateDriverLocation(driverId, location);

        // Check for geofencing alerts
        if (currentDelivery) {
          const geofenceCheck = await SupplyChainAPI.checkGeofence(
            currentDelivery.id
          );
          if (geofenceCheck.nearbyCheckpoints.length > 0) {
            setAlerts((prev) => [
              ...prev,
              {
                type: "checkpoint",
                message: `Approaching ${geofenceCheck.nearbyCheckpoints[0].name}`,
                severity: "medium",
                timestamp: new Date(),
              },
            ]);
          }
        }
      } catch (err) {
        console.error("Failed to update location:", err);
      }
    },
    [driverId, currentDelivery]
  );

  // Handle real-time shipment updates
  const handleShipmentUpdate = useCallback((updateData) => {
    console.log("Received shipment update:", updateData);

    switch (updateData.type) {
      case "location_update":
        // Update current delivery location
        setCurrentDelivery((prev) =>
          prev
            ? {
                ...prev,
                currentLocation: updateData.location,
              }
            : null
        );
        break;

      case "checkpoint_update":
        // Update checkpoint status
        setCurrentDelivery((prev) => {
          if (!prev) return null;
          const updatedRoute = prev.route.map((checkpoint) =>
            checkpoint.checkpointId === updateData.checkpointId
              ? { ...checkpoint, ...updateData.updates }
              : checkpoint
          );
          return { ...prev, route: updatedRoute };
        });
        break;

      case "status_change":
        setCurrentDelivery((prev) =>
          prev
            ? {
                ...prev,
                status: updateData.status,
              }
            : null
        );
        break;
    }
  }, []);

  // Update checkpoint status
  const updateCheckpointStatus = useCallback(
    async (checkpointId, status, notes = "") => {
      try {
        if (!currentDelivery) {
          throw new Error("No current delivery");
        }

        const deliveryId = currentDelivery._id || currentDelivery.id;
        if (!deliveryId) {
          throw new Error("No delivery ID found for checkpoint update");
        }

        console.log(`Updating checkpoint ${checkpointId} for delivery ${deliveryId} to status: ${status}`);
        
        const result = await SupplyChainAPI.updateCheckpointStatus(
          deliveryId,
          checkpointId,
          status,
          notes,
          currentLocation
        );

        console.log('Checkpoint update result:', result);
        
        // Update local state
        setCurrentDelivery(result);

        // Recalculate progress
        const completedCheckpoints = result.checkpoints.filter(
          (cp) => cp.status === "departed" || cp.status === "arrived"
        ).length;
        const progress = (completedCheckpoints / result.checkpoints.length) * 100;
        setDeliveryProgress(Math.round(progress));

        // Add success alert
        setAlerts((prev) => [
          ...prev,
          {
            type: "success",
            message: `Checkpoint "${checkpointId}" marked as ${status}`,
            severity: "low",
            timestamp: new Date(),
          },
        ]);
      } catch (err) {
        console.error("Failed to update checkpoint:", err);
        setAlerts((prev) => [
          ...prev,
          {
            type: "error",
            message: "Failed to update checkpoint status",
            severity: "high",
            timestamp: new Date(),
          },
        ]);
      }
    },
    [currentDelivery, currentLocation]
  );

  // Handle delivery status updates
  const updateDeliveryStatus = useCallback(
    async (status) => {
      try {
        if (!currentDelivery) return;

        let checkpointId = null;
        let checkpointStatus = status;

        // Map delivery status to checkpoint status
        switch (status) {
          case "picked_up":
            checkpointId = currentDelivery.origin;
            checkpointStatus = "departed";
            break;
          case "delivered":
            checkpointId = currentDelivery.destination;
            checkpointStatus = "arrived";
            break;
          case "departed":
            // Find current checkpoint
            const currentCheckpoint = currentDelivery.route.find(
              (cp) => cp.status === "current"
            );
            if (currentCheckpoint) {
              checkpointId = currentCheckpoint.checkpointId;
              checkpointStatus = "departed";
            }
            break;
        }

        if (checkpointId) {
          await updateCheckpointStatus(checkpointId, checkpointStatus);
        }
      } catch (err) {
        console.error("Failed to update delivery status:", err);
      }
    },
    [currentDelivery, updateCheckpointStatus]
  );

  // Handle photo upload
  const uploadDeliveryPhoto = useCallback(
    async (file) => {
      try {
        if (!currentDelivery) return;

        const deliveryId = currentDelivery._id || currentDelivery.id;
        if (!deliveryId) {
          throw new Error("No delivery ID found for photo upload");
        }

        const result = await SupplyChainAPI.uploadDeliveryPhoto(
          deliveryId,
          file
        );

        setAlerts((prev) => [
          ...prev,
          {
            type: "success",
            message: "Photo uploaded successfully",
            severity: "low",
            timestamp: new Date(),
          },
        ]);

        return result;
      } catch (err) {
        console.error("Failed to upload photo:", err);
        setAlerts((prev) => [
          ...prev,
          {
            type: "error",
            message: "Failed to upload photo",
            severity: "medium",
            timestamp: new Date(),
          },
        ]);
      }
    },
    [currentDelivery]
  );

  // Handle emergency
  const triggerEmergency = useCallback(
    async (message = "Emergency assistance needed") => {
      try {
        await SupplyChainAPI.triggerEmergency(
          driverId,
          currentLocation,
          message
        );

        setAlerts((prev) => [
          ...prev,
          {
            type: "emergency",
            message: "Emergency alert sent to dispatch",
            severity: "high",
            timestamp: new Date(),
          },
        ]);
      } catch (err) {
        console.error("Failed to trigger emergency:", err);
      }
    },
    [driverId, currentLocation]
  );

  // Get navigation data
  const getNavigationData = useCallback(async () => {
    try {
      if (!currentDelivery || !currentLocation) return null;

      const coordinates = [
        [currentLocation.lng, currentLocation.lat], // Current position
        [currentDelivery.destination.lng, currentDelivery.destination.lat], // Destination
      ];

      const route = await SupplyChainAPI.getRouteDirections(coordinates);
      return route;
    } catch (err) {
      console.error("Failed to get navigation data:", err);
      return null;
    }
  }, [currentDelivery, currentLocation]);

  // Clear alerts
  const clearAlert = useCallback((index) => {
    setAlerts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Manual refresh
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        // loadCurrentDelivery(),
        // loadRecentDeliveries(),
        // loadDriverStats()
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [loadCurrentDelivery /*loadDriverStats, loadRecentDeliveries*/]);

  return {
    // Data
    currentDelivery,
    driverStats,
    recentDeliveries,
    currentLocation,
    alerts,
    deliveryProgress,
    isLoading,
    error,
    isTracking,

    // Actions
    loadCurrentDelivery,
    updateCheckpointStatus,
    updateDeliveryStatus,
    uploadDeliveryPhoto,
    triggerEmergency,
    getNavigationData,
    clearAlert,
    refreshData,
    startLocationTracking,
    stopLocationTracking,
  };
};
