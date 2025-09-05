"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";


const MapComponent = dynamic(() => import("@/components/Drivermap"), {
  ssr: false, // ✅ disables SSR for Leaflet
});
import {
  MapPin,
  Navigation,
  Package,
  CheckCircle,
  AlertTriangle,
  Phone,
  MessageCircle,
  Camera,
  Menu,
  Bell,
  Fuel,
  Route,
  Shield,
  Star,
  TrendingUp,
  RefreshCw,
  Clock,
  User,
} from "lucide-react";

// Import your custom hook
import { useDriverDashboard } from "@/hooks/useDriverDashboard";
import SupplyChainAPI from "@/backend/lib/api";

function DriverDashboardContent() {
  const searchParams = useSearchParams();
  const urlDriverId = searchParams.get('driverId') || "DRIVER001";
  const [selectedDriverId, setSelectedDriverId] = useState(urlDriverId);
  const [availableDrivers, setAvailableDrivers] = useState([]);

  // Fetch available drivers from database
  const fetchAvailableDrivers = async () => {
    try {
      console.log('Fetching drivers from API...');
      const response = await fetch('http://localhost:5000/api/drivers');
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const driversData = await response.json();
        console.log('Drivers data received:', driversData);
        
        if (Array.isArray(driversData) && driversData.length > 0) {
          const formattedDrivers = driversData.map(driver => ({
            id: driver.driverId || driver.id,
            name: driver.name || 'Unknown Driver',
            status: driver.status || 'offline'
          }));
          
          console.log('Formatted drivers:', formattedDrivers);
          setAvailableDrivers(formattedDrivers);
        } else {
          console.log('No drivers found in response, using fallback');
          setAvailableDrivers([
            { id: "DRIVER001", name: "John Smith", status: "online" },
            { id: "DRIVER002", name: "Sarah Johnson", status: "offline" },
            { id: "DRIVER003", name: "Mike Wilson", status: "online" },
          ]);
        }
      } else {
        console.error('Failed to fetch drivers, status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
      console.error('Error details:', error.message);
      // Set fallback drivers on error
      setAvailableDrivers([
        { id: "DRIVER001", name: "John Smith", status: "online" },
        { id: "DRIVER002", name: "Sarah Johnson", status: "offline" },
        { id: "DRIVER003", name: "Mike Wilson", status: "online" },
      ]);
    }
  };

  // Update selectedDriverId when URL changes
  useEffect(() => {
    setSelectedDriverId(urlDriverId);
  }, [urlDriverId]);

  // Fetch drivers on component mount
  useEffect(() => {
    fetchAvailableDrivers();
  }, []);

  // Add fallback drivers if API fails
  useEffect(() => {
    if (availableDrivers.length === 0) {
      // Set some fallback drivers after a delay
      const timer = setTimeout(() => {
        console.log('Setting fallback drivers...');
        setAvailableDrivers([
          { id: "DRIVER001", name: "John Smith", status: "online" },
          { id: "DRIVER002", name: "Sarah Johnson", status: "offline" },
          { id: "DRIVER003", name: "Mike Wilson", status: "online" },
        ]);
      }, 3000); // Wait 3 seconds before showing fallback

      return () => clearTimeout(timer);
    }
  }, [availableDrivers.length]);

  const {
    currentDelivery,
    currentLocation,
    driverStats,
    recentDeliveries,
    alerts,
    deliveryProgress,
    isLoading,
    error,
    isTracking,
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
  } = useDriverDashboard(selectedDriverId, { autoStartTracking: false });
  //

  //
  const [activeTab, setActiveTab] = useState("current");
  const [notifications, setNotifications] = useState(alerts.length);
  const [routeCoords, setRouteCoords] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [nextCheckpoint, setNextCheckpoint] = useState(null);
  const fileInputRef = React.useRef(null);

  // Update notifications count when alerts change
  useEffect(() => {
    setNotifications(alerts.length);
  }, [alerts]);

  // Fetch dynamic route when location and destination are available
  useEffect(() => {
    const fetchRoute = async () => {
      if (!currentLocation || !currentDelivery?.destination) return;
      
      try {
        const coordinates = [
          [currentLocation.lng, currentLocation.lat], // Current position
          [currentDelivery.destination.lng, currentDelivery.destination.lat], // Destination
        ];

        const route = await SupplyChainAPI.getRouteDirections(coordinates);
        if (route && route.coordinates) {
          // Convert route coordinates to [lat, lng] format for Leaflet
          const routeCoords = route.coordinates.map(coord => [coord[1], coord[0]]);
          setRouteCoords(routeCoords);
        }
      } catch (err) {
        console.error("Failed to fetch route:", err);
        // Fallback to straight line if route fails
        setRouteCoords([
          [currentLocation.lat, currentLocation.lng],
          [currentDelivery.destination.lat, currentDelivery.destination.lng]
        ]);
      }
    };

    fetchRoute();
  }, [currentLocation, currentDelivery?.destination]);

  // Calculate remaining time and next checkpoint
  useEffect(() => {
    const calculateRemainingTime = async () => {
      if (!currentLocation || !currentDelivery) return;

      try {
        const response = await fetch(
          `http://localhost:5000/api/deliveries/${currentDelivery._id}/remaining-time?currentLat=${currentLocation.lat}&currentLng=${currentLocation.lng}`
        );
        const data = await response.json();
        
        if (data.remainingTime !== undefined) {
          setRemainingTime(data.remainingTime);
          setNextCheckpoint(data.nextCheckpoint);
        }
      } catch (err) {
        console.error("Failed to calculate remaining time:", err);
      }
    };

    calculateRemainingTime();
    
    // Update every minute
    const interval = setInterval(calculateRemainingTime, 60000);
    return () => clearInterval(interval);
  }, [currentLocation, currentDelivery]);

  const handleStatusUpdate = async (newStatus) => {
    if (!currentDelivery) return;

    // Use _id (MongoDB ObjectId) instead of id
    const deliveryId = currentDelivery._id || currentDelivery.id;
    if (!deliveryId) {
      console.error("No delivery ID found:", currentDelivery);
      alert("Error: No delivery ID found");
      return;
    }

    try {
      console.log(`Updating delivery ${deliveryId} status to: ${newStatus}`);
      const response = await fetch(
        `http://localhost:5000/api/deliveries/${deliveryId}/status`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus })
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log("Status update successful:", data);
        
        // Show success message with better formatting
        const successMessage = newStatus === "delivered" 
          ? `🎉 Delivery Completed Successfully!\n\nOrder: ${currentDelivery.orderId}\nCustomer: ${currentDelivery.customerName}\nStatus: ${data.currentStatus || newStatus}`
          : `✅ Successfully updated status to ${data.currentStatus || newStatus}`;
        
        alert(successMessage);
        
        // Refresh the delivery data to show updated status
        if (loadCurrentDelivery) {
          loadCurrentDelivery();
        }
      } else {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Status update error:", err);
      alert(`❌ Failed to update status: ${err.message}`);
    }
  };

  // Picked up flow: capture photo, upload, notify supplier and customer, then mark picked up
  const handlePickedUp = useCallback(async () => {
    if (!currentDelivery) return;
    try {
      // Trigger photo capture
      if (fileInputRef.current) {
        fileInputRef.current.click();
        return; // continue in onPhotoSelected
      }
    } catch (err) {
      console.error("Pickup flow error:", err);
    }
  }, [currentDelivery]);

  const onPhotoSelected = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file || !currentDelivery) return;
      
      try {
        // Show loading message
        alert("📸 Uploading photo...");
        
        await uploadDeliveryPhoto(file);
        alert("✅ Photo uploaded successfully!");

        // Notify supplier and customer
        const deliveryId = currentDelivery._id || currentDelivery.id;
        const message = `Parcel picked up for order ${currentDelivery.orderId || deliveryId}.`;
        await SupplyChainAPI.sendDeliveryNotification(deliveryId, "picked_up", message);

        // Update status via existing route
        await handleStatusUpdate("picked_up");
      } catch (err) {
        console.error("Photo upload / notification failed:", err);
        alert(`❌ Photo upload failed: ${err.message}`);
      } finally {
        // reset input
        if (e.target) e.target.value = "";
      }
    },
    [currentDelivery, uploadDeliveryPhoto]
  );

  const handleCheckpointReached = useCallback(
    async (checkpointId) => {
      try {
        console.log(`Checkpoint ${checkpointId} reached`);
        console.log('Current delivery checkpoints:', currentDelivery?.checkpoints);
        alert("📍 Updating checkpoint status...");
        
        await updateCheckpointStatus(
          checkpointId,
          "arrived",
          "Checkpoint reached by driver"
        );
        
        alert("✅ Checkpoint status updated successfully!");
      } catch (err) {
        console.error("Checkpoint update failed:", err);
        alert(`❌ Failed to update checkpoint: ${err.message}`);
      }
    },
    [updateCheckpointStatus, currentDelivery]
  );

  const handleEmergency = useCallback(async () => {
    console.log("Emergency button pressed");
    await triggerEmergency(
      "Emergency assistance needed - Driver requested help"
    );
  }, [triggerEmergency]);
  //

  const handleNavigation = useCallback(async () => {
    console.log("Opening navigation");

    const fromLat = currentLocation?.lat;
    const fromLng = currentLocation?.lng;
    const toLat = currentDelivery?.destination?.lat || currentDelivery?.to?.lat;
    const toLng = currentDelivery?.destination?.lng || currentDelivery?.to?.lng;

    try {
      const response = await fetch(
        `http://localhost:5000/api/driver/navigation?fromLat=${fromLat}&fromLng=${fromLng}&toLat=${toLat}&toLng=${toLng}`
      );

      if (!response.ok) throw new Error("Failed to fetch navigation data");

      const data = await response.json();

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err) {
      console.error("Navigation error:", err);
    }
  }, [currentLocation, currentDelivery]);

  //

  const handlePhotoUpload = useCallback(
    async (event) => {
      const file = event.target.files[0];
      if (file && currentDelivery) {
        await uploadDeliveryPhoto(file);
      }
    },
    [uploadDeliveryPhoto, currentDelivery]
  );

  // Delivered flow: notify supplier and mark delivered
  const handleDelivered = useCallback(async () => {
    if (!currentDelivery) return;
    try {
      const deliveryId = currentDelivery._id || currentDelivery.id;
      const message = `Parcel delivered for order ${currentDelivery.orderId || deliveryId}.`;
      await SupplyChainAPI.sendDeliveryNotification(deliveryId, "delivered", message);
      await handleStatusUpdate("delivered");
    } catch (err) {
      console.error("Delivered notification failed:", err);
    }
  }, [currentDelivery]);
  //
  const destination = currentDelivery?.destination || {
    lat: 19.076,
    lng: 72.8777,
  };

  if (isLoading) return <p>Loading dashboard...</p>;
  if (error) return <p>Error: {error}</p>;
  //
  // Format delivery data for display
  const getFormattedDelivery = () => {
    if (!currentDelivery) return null;

    return {
      id: currentDelivery.id || "DEL-2024-001",
      packageId: currentDelivery.orderId || "PKG-789",
      from:
        currentDelivery.origin?.name ||
        currentDelivery.from ||
        "Warehouse A, Mumbai",
      to:
        currentDelivery.destination?.name ||
        currentDelivery.to ||
        "Customer Location, Pune",
      customerName: currentDelivery.customerName || "Customer",
      customerPhone: currentDelivery.customerPhone || "+91 98765 43210",
      estimatedTime: currentDelivery.estimatedDelivery
        ? new Date(currentDelivery.estimatedDelivery).toLocaleTimeString()
        : "2h 30m",
      distance: currentDelivery.totalDistance
        ? `${currentDelivery.totalDistance} km`
        : "148 km",
      status: currentDelivery.status || "in_transit",
      checkpoints: currentDelivery.route || [],
    };
  };

  const formattedDelivery = getFormattedDelivery();
  const formattedStats = driverStats || {
    rating: 4.8,
    totalDeliveries: 156,
    onTimeRate: 94,
    todayDeliveries: 3,
    weeklyEarnings: 2850,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <a href="/drivers">
                <Menu className="h-5 w-5" />
              </a>
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">
              Driver Dashboard
            </h1>
            <div className="ml-4 flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <select
                value={selectedDriverId}
                onChange={(e) => setSelectedDriverId(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableDrivers.length > 0 ? (
                  availableDrivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name} ({driver.id})
                    </option>
                  ))
                ) : (
                  <option value="DRIVER001">Loading drivers...</option>
                )}
              </select>
            </div>
            {error && (
              <Badge variant="destructive" className="ml-2">
                Connection Error
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{formattedStats.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="font-medium">
                  {formattedStats.onTimeRate}%
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isTracking ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span className="font-medium text-xs">
                  {isTracking ? "Live" : "Offline"}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={refreshData}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {notifications}
                </Badge>
              )}
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/driver-profile.png" />
              <AvatarFallback>DK</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-73px)]">
        {/* Map Section */}
        <div className="flex-1 relative">
          <div className="h-full bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden">
            {/* Map Box */}
            {/* Mock Map Interface */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-fit max-w-6xl bg-white rounded-lg shadow-lg m-4 overflow-hidden">
                {/*  */}

                {/* Map Container */}
                <div className="h-full w-full relative z-0">
                  {!currentLocation ? (
                    <div className="flex items-center justify-center h-full ">
                      <p className="text-gray-500">Waiting for GPS signal...</p>
                    </div>
                  ) : (
                    <MapComponent
                      currentLocation={currentLocation}
                      destination={[destination.lat, destination.lng]}
                      route={routeCoords}
                    />
                  )}
                </div>
                {/*  */}
                {/* Map Header */}
                <div className="absolute top-4 left-4 right-4 z-50">
                  <Card className="bg-white/95 backdrop-blur-sm">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full animate-pulse ${
                              isTracking ? "bg-green-500" : "bg-red-500"
                            }`}
                          ></div>
                          <span className="text-sm font-medium">
                            {isTracking
                              ? "Live Tracking Active"
                              : "Tracking Inactive"}
                          </span>
                          {currentLocation && (
                            <span className="text-xs text-gray-500">
                              ({currentLocation.lat.toFixed(4)},{" "}
                              {currentLocation.lng.toFixed(4)})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-blue-50">
                            <Fuel className="h-3 w-3 mr-1" />
                            75%
                          </Badge>
                          {formattedDelivery && (
                            <Badge
                              variant="secondary"
                              className="bg-blue-100 text-blue-700"
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              {remainingTime > 0 ? `${remainingTime} min remaining` : formattedDelivery.estimatedTime} ETA
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Map Section */}

                {/* Real-time Info Overlay */}
                {currentDelivery && (
                  <div className="absolute top-20 left-4 right-4">
                    <Card className="bg-white/90 backdrop-blur-sm">
                      <CardContent className="p-3">
                        <div className="text-sm">
                          <div className="font-medium">
                            {formattedDelivery.packageId}
                          </div>
                          <div className="text-gray-600">
                            {formattedDelivery.distance} • {deliveryProgress}%
                            Complete
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="absolute bottom-4 left-4 flex flex-col gap-2">
              <Button
                size="sm"
                variant={isTracking ? "outline" : "default"}
                className={isTracking ? "bg-white text-gray-800" : "bg-gray-800 hover:bg-gray-900"}
                onClick={() => (isTracking ? stopLocationTracking() : startLocationTracking())}
              >
                {isTracking ? (
                  <>
                    <Navigation className="h-4 w-4 mr-2" /> Stop Tracking
                  </>
                ) : (
                  <>
                    <Navigation className="h-4 w-4 mr-2" /> Start Tracking
                  </>
                )}
              </Button>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={handlePickedUp}
                disabled={!currentDelivery}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Picked Up
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleNavigation}
                disabled={!currentLocation || !currentDelivery}
              >
                <Route className="h-4 w-4 mr-2" />
                Navigate
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleDelivered}
                disabled={!currentDelivery}
              >
                <Package className="h-4 w-4 mr-2" />
                Delivered
              </Button>
              {/* Hidden input for photo capture on pickup */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={onPhotoSelected}
              />
            </div>

            {/* Emergency Button */}
            <div className="absolute bottom-4 right-4">
              <Button
                size="sm"
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
                onClick={handleEmergency}
              >
                <Shield className="h-4 w-4 mr-2" />
                Emergency
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-96 bg-white border-l overflow-y-auto">
          <div className="p-4">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="current">Current</TabsTrigger>
                <TabsTrigger value="stats">Stats</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              {/* Current Delivery Tab */}
              <TabsContent value="current" className="space-y-4">
                {formattedDelivery ? (
                  <>
                    {/* Current Delivery Card */}
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            Current Delivery
                          </CardTitle>
                          <Badge
                            className={`${
                              formattedDelivery.status === "delivered"
                                ? "bg-green-100 text-green-700"
                                : formattedDelivery.status === "in_transit"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {formattedDelivery.status
                              .replace("_", " ")
                              .toUpperCase()}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-sm">From</p>
                              <p className="text-sm text-gray-600">
                                {formattedDelivery.from}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-sm">To</p>
                              <p className="text-sm text-gray-600">
                                {formattedDelivery.to}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span className="font-medium">
                              {deliveryProgress}%
                            </span>
                          </div>
                          <Progress value={deliveryProgress} className="h-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Distance</p>
                            <p className="font-medium">
                              {formattedDelivery.distance}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">ETA</p>
                            <p className="font-medium">
                              {remainingTime > 0 ? `${remainingTime} min` : formattedDelivery.estimatedTime}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Customer Info */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">
                          Customer Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="font-medium">
                            {formattedDelivery.customerName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formattedDelivery.customerPhone}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 bg-transparent"
                            onClick={() =>
                              window.open(
                                `tel:${formattedDelivery.customerPhone}`
                              )
                            }
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Call
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 bg-transparent"
                            onClick={() =>
                              window.open(
                                `sms:${formattedDelivery.customerPhone}`
                              )
                            }
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            SMS
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Delivery Checkpoints */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">
                          Delivery Checkpoints
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {currentDelivery?.checkpoints?.map(
                            (checkpoint, index) => (
                              <div
                                key={checkpoint.checkpointId || checkpoint.id}
                                className="flex items-center gap-3"
                              >
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                                    checkpoint.status === "departed" ||
                                    checkpoint.status === "completed"
                                      ? "bg-green-100 text-green-700"
                                      : checkpoint.status === "arrived" ||
                                        checkpoint.status === "current"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-gray-100 text-gray-500"
                                  }`}
                                >
                                  {checkpoint.status === "departed" ||
                                  checkpoint.status === "completed" ? (
                                    <CheckCircle className="h-4 w-4" />
                                  ) : (
                                    index + 1
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-sm">
                                    {checkpoint.name}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {checkpoint.location?.address || checkpoint.estimatedArrival
                                      ? new Date(
                                          checkpoint.estimatedArrival
                                        ).toLocaleTimeString()
                                      : checkpoint.time || "Pending"}
                                  </p>
                                  {checkpoint.actualArrival && (
                                    <p className="text-xs text-green-600">
                                      Arrived:{" "}
                                      {new Date(
                                        checkpoint.actualArrival
                                      ).toLocaleTimeString()}
                                    </p>
                                  )}
                                </div>
                                {(checkpoint.status === "pending" ||
                                  checkpoint.status === "current") && (
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleCheckpointReached(
                                        checkpoint.checkpointId || checkpoint.id
                                      )
                                    }
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    Reached
                                  </Button>
                                )}
                              </div>
                            )
                          )}
                          {nextCheckpoint && (
                            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <p className="text-sm font-medium text-yellow-800">
                                Next: {nextCheckpoint}
                              </p>
                              <p className="text-xs text-yellow-600">
                                {remainingTime} minutes remaining
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No active delivery</p>
                      <p className="text-sm text-gray-500">
                        Check back later for new assignments
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Actions */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => handleStatusUpdate("picked_up")}
                      disabled={!currentDelivery}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Mark as Picked Up
                    </Button>

                    <Button
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      onClick={() => handleStatusUpdate("delivered")}
                      disabled={!currentDelivery}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Delivered
                    </Button>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={!currentDelivery}
                      />
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        disabled={!currentDelivery}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Add Photo Proof
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Alerts Section */}
                <div className="space-y-2">
                  {alerts.map((alert, index) => (
                    <Card
                      key={index}
                      className={`${
                        alert.severity === "high"
                          ? "border-red-200 bg-red-50"
                          : alert.severity === "medium"
                          ? "border-orange-200 bg-orange-50"
                          : "border-yellow-200 bg-yellow-50"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle
                            className={`h-5 w-5 mt-0.5 ${
                              alert.severity === "high"
                                ? "text-red-600"
                                : alert.severity === "medium"
                                ? "text-orange-600"
                                : "text-yellow-600"
                            }`}
                          />
                          <div className="flex-1">
                            <p
                              className={`font-medium text-sm ${
                                alert.severity === "high"
                                  ? "text-red-800"
                                  : alert.severity === "medium"
                                  ? "text-orange-800"
                                  : "text-yellow-800"
                              }`}
                            >
                              {alert.type === "weather"
                                ? "Weather Alert"
                                : alert.type === "traffic"
                                ? "Traffic Alert"
                                : alert.type === "fuel"
                                ? "Fuel Alert"
                                : alert.type === "checkpoint"
                                ? "Checkpoint Alert"
                                : alert.type === "emergency"
                                ? "Emergency Alert"
                                : "System Alert"}
                            </p>
                            <p
                              className={`text-sm ${
                                alert.severity === "high"
                                  ? "text-red-700"
                                  : alert.severity === "medium"
                                  ? "text-orange-700"
                                  : "text-yellow-700"
                              }`}
                            >
                              {alert.message}
                            </p>
                            {alert.timestamp && (
                              <p className="text-xs text-gray-500 mt-1">
                                {alert.timestamp.toLocaleTimeString()}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => clearAlert(index)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            ×
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {alerts.length === 0 && (
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="p-4 text-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-2" />
                        <p className="text-sm text-green-700">
                          All clear - No alerts
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Driver Statistics Tab */}
              <TabsContent value="stats" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Today's Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {formattedStats.todayDeliveries}
                        </div>
                        <div className="text-sm text-gray-600">Deliveries</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          ₹{formattedStats.weeklyEarnings}
                        </div>
                        <div className="text-sm text-gray-600">
                          Weekly Earnings
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Overall Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Driver Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">
                          {formattedStats.rating}/5.0
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Deliveries</span>
                      <span className="font-medium">
                        {formattedStats.totalDeliveries}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">On-Time Rate</span>
                      <span className="font-medium text-green-600">
                        {formattedStats.onTimeRate}%
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Vehicle Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Fuel Level</span>
                      <div className="flex items-center gap-2">
                        <Progress value={75} className="w-20 h-2" />
                        <span className="text-sm font-medium">75%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">GPS Status</span>
                      <Badge variant={isTracking ? "default" : "destructive"}>
                        {isTracking ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Next Service</span>
                      <span className="text-sm font-medium">2,500 km</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Delivery History Tab */}
              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Deliveries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentDeliveries.length > 0 ? (
                        recentDeliveries.map((delivery) => (
                          <div
                            key={delivery.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <div className="font-medium text-sm">
                                {delivery.id || delivery.orderId}
                              </div>
                              <div className="text-sm text-gray-600">
                                {delivery.customer || delivery.customerName}
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant="default" className="mb-1">
                                {delivery.status || "Delivered"}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500" />
                                <span className="text-xs">
                                  {delivery.rating || 5}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            No recent deliveries
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Weekly Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">

                      <div className="flex justify-between">
                        <span className="text-sm">Distance Covered</span>
                        <span className="font-medium">
                          {formattedStats.weeklyDistance || "1,247"} km
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Average Rating</span>
                        <span className="font-medium">
                          {formattedStats.rating}/5.0
                        </span>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export with client-side only rendering to prevent hydration issues
export default function DriverDashboard() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return <DriverDashboardContent />;
}
