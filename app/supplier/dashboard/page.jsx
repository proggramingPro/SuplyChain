"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import io from 'socket.io-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Package,
  Truck,
  MapPin,
  Clock,
  AlertTriangle,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Download,
  Bell,
  Settings,
  User,
  Loader2,
  X,
  Trash2,
} from "lucide-react"

function SupplierDashboardContent() {
  const [activeShipments, setActiveShipments] = useState(12)
  const [completedToday, setCompletedToday] = useState(8)
  const [delayedShipments, setDelayedShipments] = useState(3)
  const [isCreating, setIsCreating] = useState(false)
  const [showAddDriver, setShowAddDriver] = useState(false)
  const [newDriver, setNewDriver] = useState({ name: "", phone: "", email: "", licenseNumber: "", loginId: "", password: "" })
  const [destinations, setDestinations] = useState([{ name: "", address: "", lat: "", lng: "", isGeocoding: false }])
  const [shipmentData, setShipmentData] = useState({
    customerName: "",
    customerPhone: "",
    packageType: "",
    priority: "",
    notes: "",
    assignedDriver: ""
  })
  const [alerts, setAlerts] = useState([])
  const [notifications, setNotifications] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [drivers, setDrivers] = useState([])
  const [shipments, setShipments] = useState([])
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(true)
  const [isLoadingShipments, setIsLoadingShipments] = useState(true)
  const socketRef = useRef(null)

  // Set client-side flag
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Initialize WebSocket connection only on client
  useEffect(() => {
    if (!isClient) return

    socketRef.current = io('https://suply-chain-l1jg.vercel.app/')
    
    socketRef.current.on('connect', () => {
      console.log('Supplier dashboard connected to WebSocket')
    })

    socketRef.current.on('delivery-notification', (notification) => {
      console.log('Received delivery notification:', notification)
      setAlerts(prev => [...prev, {
        id: Date.now(),
        type: notification.type,
        message: notification.message,
        shipmentId: notification.shipmentId,
        timestamp: new Date(notification.timestamp),
        severity: notification.type === 'emergency' ? 'high' : 'medium'
      }])
      setNotifications(prev => prev + 1)
    })

    socketRef.current.on('emergency-alert', (alert) => {
      console.log('Received emergency alert:', alert)
      setAlerts(prev => [...prev, {
        id: Date.now(),
        type: 'emergency',
        message: `Emergency from Driver ${alert.driverId}: ${alert.message}`,
        driverId: alert.driverId,
        location: alert.location,
        timestamp: new Date(alert.timestamp),
        severity: 'high'
      }])
      setNotifications(prev => prev + 1)
    })

    socketRef.current.on('delivery-status-update', (update) => {
      console.log('Received delivery status update:', update)
      setAlerts(prev => [...prev, {
        id: Date.now(),
        type: 'status_update',
        message: `Delivery ${update.deliveryId} status updated to ${update.status}`,
        deliveryId: update.deliveryId,
        status: update.status,
        customerName: update.customerName,
        driverId: update.driverId,
        timestamp: new Date(update.timestamp),
        severity: update.status === 'delivered' ? 'low' : 'medium'
      }])
      setNotifications(prev => prev + 1)
      
      // Refresh shipments to show updated status
      fetchShipments()
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [isClient])

  // Fetch data on component mount
  useEffect(() => {
    if (isClient) {
      fetchDrivers()
      fetchShipments()
    }
  }, [isClient])

  // Clear alert function
  const clearAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
    setNotifications(prev => Math.max(0, prev - 1))
  }

  // Fetch drivers from database
  const fetchDrivers = async () => {
    try {
      setIsLoadingDrivers(true)
      console.log('Supplier dashboard: Fetching drivers...')
      const response = await fetch('https://suply-chain-l1jg.vercel.app//api/drivers')
      console.log('Supplier dashboard: Response status:', response.status)
      
      if (response.ok) {
        const driversData = await response.json()
        console.log('Supplier dashboard: Drivers data received:', driversData)
        console.log('Supplier dashboard: Number of drivers:', driversData.length)
        console.log('Supplier dashboard: Driver statuses:', driversData.map(d => ({ name: d.name, status: d.status })))
        setDrivers(driversData)
      } else {
        console.error('Failed to fetch drivers, status:', response.status)
      }
    } catch (error) {
      console.error('Error fetching drivers:', error)
    } finally {
      setIsLoadingDrivers(false)
    }
  }

  // Fetch shipments from database
  const fetchShipments = async () => {
    try {
      setIsLoadingShipments(true)
      const response = await fetch('https://suply-chain-l1jg.vercel.app//api/deliveries')
      if (response.ok) {
        const shipmentsData = await response.json()
        setShipments(shipmentsData)
      } else {
        console.error('Failed to fetch shipments')
      }
    } catch (error) {
      console.error('Error fetching shipments:', error)
    } finally {
      setIsLoadingShipments(false)
    }
  }

  // Geocoding functions
  const geocodeAddress = async (index) => {
    const destination = destinations[index]
    if (!destination.address.trim()) return

    const updated = [...destinations]
    updated[index].isGeocoding = true
    setDestinations(updated)

    try {
      const response = await fetch(
        `https://suply-chain-l1jg.vercel.app//api/utils/geocode?address=${encodeURIComponent(destination.address)}`
      )
      
      if (response.ok) {
        const data = await response.json()
        updated[index] = {
          ...updated[index],
          lat: data.lat.toString(),
          lng: data.lng.toString(),
          name: data.formatted.name,
          address: data.formatted.address,
          isGeocoding: false
        }
      } else {
        throw new Error("Geocoding failed")
      }
    } catch (error) {
      console.error("Geocoding error:", error)
      updated[index].isGeocoding = false
      alert(`Failed to find coordinates for: ${destination.address}`)
    }

    setDestinations(updated)
  }

  const addDestination = () => {
    setDestinations([...destinations, { name: "", address: "", lat: "", lng: "", isGeocoding: false }])
  }

  const removeDestination = (index) => {
    if (destinations.length > 1) {
      setDestinations(destinations.filter((_, i) => i !== index))
    }
  }

  const updateDestination = (index, field, value) => {
    const updated = [...destinations]
    updated[index][field] = value
    setDestinations(updated)
  }

  // Driver management functions
  const deleteDriver = async (driverId) => {
    if (!confirm(`Are you sure you want to delete driver ${driverId}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`https://suply-chain-l1jg.vercel.app//api/drivers/${driverId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        alert(`Driver ${driverId} deleted successfully!`);
        // Refresh drivers list
        fetchDrivers();
      } else {
        throw new Error("Failed to delete driver");
      }
    } catch (error) {
      console.error("Error deleting driver:", error);
      alert("Failed to delete driver");
    }
  };

  const addDriver = async () => {
    try {
      const response = await fetch("https://suply-chain-l1jg.vercel.app//api/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newDriver,
          status: "offline",
          stats: { totalDeliveries: 0, rating: 5.0, onTimeRate: 100, weeklyDeliveries: 0, weeklyEarnings: 0 }
        })
      })

      if (response.ok) {
        const driver = await response.json()
        setNewDriver({ name: "", phone: "", email: "", licenseNumber: "", loginId: "", password: "" })
        setShowAddDriver(false)
        alert(`Driver added successfully!\n\nDriver ID: ${driver.driverId}\nLogin ID: ${driver.loginId}\nPassword: ${driver.password}`)
        // Refresh drivers list
        fetchDrivers()
      } else {
        throw new Error("Failed to add driver")
      }
    } catch (error) {
      console.error("Error adding driver:", error)
      alert("Failed to add driver")
    }
  }

 const createShipment = async () => {
  try {
    setIsCreating(true);
    
    const validDestinations = destinations.filter(dest => 
      dest.name && dest.address && dest.lat && dest.lng
    );

    if (validDestinations.length === 0) {
      alert("Please add at least one valid destination");
      return;
    }

    const deliveryData = {
      customerName: shipmentData.customerName,
      customerPhone: shipmentData.customerPhone,
      supplierId: shipmentData.supplierId || "SUPPLIER001",
      consumerId: shipmentData.consumerId || "CONSUMER001",
      supplierName: shipmentData.supplierName || "TechMart Supply",
      orderId: `ORD-${Date.now()}`,
      origin: shipmentData.origin || {
        name: "TechMart Warehouse, Mumbai",
        lat: 19.076,
        lng: 72.8777,
        address: "TechMart Warehouse, Mumbai"
      },
      destination: validDestinations[validDestinations.length - 1],
      checkpoints: validDestinations.map((dest, index) => ({
        id: `cp-${Date.now()}-${index}`,
        name: dest.name,
        location: {
          lat: parseFloat(dest.lat),
          lng: parseFloat(dest.lng),
          address: dest.address
        },
        status: "pending",
        order: index,
        estimatedArrival: new Date(Date.now() + (index + 1) * 30 * 60 * 1000)
      })),
      currentStatus: "pending",
      estimatedDelivery: new Date(Date.now() + validDestinations.length * 30 * 60 * 1000),
      totalDistance: validDestinations.length * 50,
      remainingTime: validDestinations.length * 30,
      packageType: shipmentData.packageType,
      priority: shipmentData.priority,
      notes: shipmentData.notes,
      driverId: shipmentData.assignedDriver || "DRIVER001",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const response = await fetch("https://suply-chain-l1jg.vercel.app//api/deliveries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(deliveryData)
    });

    if (response.ok) {
      const newDelivery = await response.json();
      alert("Shipment created successfully! Driver has been notified.");
      
      setDestinations([{ name: "", address: "", lat: "", lng: "", isGeocoding: false }]);
      setShipmentData({
        customerName: "",
        customerPhone: "",
        packageType: "",
        priority: "",
        notes: "",
        assignedDriver: "",
        supplierId: "",
        consumerId: "",
        supplierName: "",
        origin: null
      });

      fetchShipments();
    } else {
      const errorText = await response.text();
      throw new Error(`Failed to create shipment: ${errorText}`);
    }
  } catch (error) {
    console.error("Error creating shipment:", error);
    alert("Failed to create shipment");
  } finally {
    setIsCreating(false);
  }
};


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Supplier Dashboard</h1>
            <p className="text-gray-600">Welcome back, Supply Manager</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <a href="/drivers">
                <User className="h-4 w-4 mr-2" />
                View All Drivers
              </a>
            </Button>
            <Button variant="outline" size="sm" className="relative">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
              {notifications > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {notifications}
                </Badge>
              )}
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Shipment
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeShipments}</div>
              <p className="text-xs text-gray-600">+2 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <Truck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedToday}</div>
              <p className="text-xs text-gray-600">+12% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delayed Shipments</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{delayedShipments}</div>
              <p className="text-xs text-gray-600">-1 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.2%</div>
              <p className="text-xs text-gray-600">+2.1% from last week</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="mb-6 space-y-2">
            {alerts.map((alert) => (
              <Card
                key={alert.id}
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
                        {alert.type === "emergency"
                          ? "Emergency Alert"
                          : alert.type === "picked_up"
                          ? "Package Picked Up"
                          : alert.type === "delivered"
                          ? "Package Delivered"
                          : "Delivery Update"}
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
                      onClick={() => clearAlert(alert.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="shipments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="shipments">Shipments</TabsTrigger>
            <TabsTrigger value="drivers">Drivers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="create">Create Shipment</TabsTrigger>
          </TabsList>

          {/* Shipments Tab */}
          <TabsContent value="shipments" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Active Shipments</CardTitle>
                    <CardDescription>Monitor and manage your current deliveries</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search shipments..." className="pl-10 w-64" />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingShipments ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Loading shipments...</span>
                  </div>
                ) : (
                <div className="space-y-4">
                    {shipments.length > 0 ? (
                      shipments.map((shipment) => {
                        // Calculate progress based on checkpoints
                        const completedCheckpoints = shipment.checkpoints?.filter(
                          cp => cp.status === "departed" || cp.status === "arrived"
                        ).length || 0;
                        const totalCheckpoints = shipment.checkpoints?.length || 1;
                        const progress = Math.round((completedCheckpoints / totalCheckpoints) * 100);
                        
                        // Get driver name
                        const driver = drivers.find(d => d.driverId === shipment.driverId);
                        const driverName = driver ? driver.name : `Driver ${shipment.driverId}`;
                        
                        // Calculate ETA
                        const eta = shipment.estimatedDelivery 
                          ? new Date(shipment.estimatedDelivery).toLocaleTimeString()
                          : "TBD";
                        
                        return (
                    <div key={shipment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                                <div className="font-semibold text-lg">{shipment.orderId}</div>
                          <Badge
                            variant={
                                    shipment.currentStatus === "delivered"
                                ? "default"
                                      : shipment.currentStatus === "delayed"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                                  {shipment.currentStatus?.replace('_', ' ').toUpperCase() || 'PENDING'}
                          </Badge>
                                <Badge variant="outline">
                                  {shipment.priority || 'MEDIUM'} Priority
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Customer</div>
                                <div className="font-medium">{shipment.customerName}</div>
                                <div className="text-xs text-gray-500">{shipment.customerPhone}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Destination</div>
                          <div className="font-medium flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                                  {shipment.destination?.name || 'Unknown'}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Driver</div>
                                <div className="font-medium">{driverName}</div>
                                <div className="text-xs text-gray-500">{shipment.driverId}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">ETA</div>
                          <div className="font-medium flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                                  {eta}
                                </div>
                                {shipment.remainingTime && (
                                  <div className="text-xs text-gray-500">
                                    {shipment.remainingTime} min remaining
                          </div>
                                )}
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Progress</span>
                                <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No shipments found</p>
                        <p className="text-sm text-gray-500">Create your first shipment to get started</p>
                      </div>
                    )}
                </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Drivers Tab */}
          <TabsContent value="drivers" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                <CardTitle>Driver Management</CardTitle>
                <CardDescription>Monitor driver performance and availability</CardDescription>
                  </div>
                  <Dialog open={showAddDriver} onOpenChange={setShowAddDriver}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Driver
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Driver</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="driver-name">Full Name</Label>
                          <Input
                            id="driver-name"
                            value={newDriver.name}
                            onChange={(e) => setNewDriver({...newDriver, name: e.target.value})}
                            placeholder="Enter driver name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="driver-phone">Phone Number</Label>
                          <Input
                            id="driver-phone"
                            value={newDriver.phone}
                            onChange={(e) => setNewDriver({...newDriver, phone: e.target.value})}
                            placeholder="Enter phone number"
                          />
                        </div>
                        <div>
                          <Label htmlFor="driver-email">Email</Label>
                          <Input
                            id="driver-email"
                            type="email"
                            value={newDriver.email}
                            onChange={(e) => setNewDriver({...newDriver, email: e.target.value})}
                            placeholder="Enter email address"
                          />
                        </div>
                        <div>
                          <Label htmlFor="driver-license">License Number</Label>
                          <Input
                            id="driver-license"
                            value={newDriver.licenseNumber}
                            onChange={(e) => setNewDriver({...newDriver, licenseNumber: e.target.value})}
                            placeholder="Enter license number"
                          />
                        </div>
                        <div>
                          <Label htmlFor="driver-login">Login ID (Optional)</Label>
                          <Input
                            id="driver-login"
                            value={newDriver.loginId}
                            onChange={(e) => setNewDriver({...newDriver, loginId: e.target.value})}
                            placeholder="Auto-generated as Driver ID if empty"
                          />
                        </div>
                        <div>
                          <Label htmlFor="driver-password">Password (Auto-generated)</Label>
                          <Input
                            id="driver-password"
                            type="text"
                            value="Same as Driver ID"
                            disabled
                            className="bg-gray-100"
                            placeholder="Password will be same as Driver ID"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={addDriver} className="flex-1">
                            Add Driver
                          </Button>
                          <Button variant="outline" onClick={() => setShowAddDriver(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingDrivers ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Loading drivers...</span>
                  </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {drivers.length > 0 ? (
                      drivers.map((driver) => (
                        <div key={driver.driverId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-semibold">{driver.name}</div>
                            <Badge variant={driver.status === "online" ? "default" : "secondary"}>
                              {driver.status?.toUpperCase() || 'OFFLINE'}
                            </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">ID</span>
                              <span className="font-medium text-xs">{driver.driverId}</span>
                            </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rating</span>
                              <span className="font-medium">⭐ {driver.stats?.rating || 5.0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Deliveries</span>
                              <span className="font-medium">{driver.stats?.totalDeliveries || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Phone</span>
                              <span className="font-medium text-xs">{driver.phone || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Email</span>
                              <span className="font-medium text-xs">{driver.email || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Login ID</span>
                          <span className="font-medium text-xs text-blue-600">{driver.loginId || driver.driverId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Password</span>
                          <span className="font-medium text-xs text-green-600">{driver.password || driver.driverId}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        Assign Shipment
                      </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => deleteDriver(driver.driverId)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8">
                        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No drivers found</p>
                        <p className="text-sm text-gray-500">Add your first driver to get started</p>
                    </div>
                    )}
                </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Average Delivery Time</span>
                      <span className="font-semibold">2.4 hours</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Customer Satisfaction</span>
                      <span className="font-semibold">4.7/5.0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Cost per Delivery</span>
                      <span className="font-semibold">$12.50</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Fuel Efficiency</span>
                      <span className="font-semibold">15.2 MPG</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Weather Delays</span>
                      <Badge variant="outline">2 Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Traffic Issues</span>
                      <Badge variant="destructive">1 High Risk</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Vehicle Maintenance</span>
                      <Badge variant="secondary">3 Scheduled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Route Optimization</span>
                      <Badge variant="default">94% Efficient</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Create Shipment Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Shipment</CardTitle>
                <CardDescription>Set up a new delivery with multiple stops and driver assignment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Customer Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customer">Customer Name</Label>
                      <Input 
                        id="customer" 
                        value={shipmentData.customerName}
                        onChange={(e) => setShipmentData({...shipmentData, customerName: e.target.value})}
                        placeholder="Enter customer name" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Customer Phone</Label>
                      <Input 
                        id="phone" 
                        value={shipmentData.customerPhone}
                        onChange={(e) => setShipmentData({...shipmentData, customerPhone: e.target.value})}
                        placeholder="Enter phone number" 
                      />
                    </div>
                    </div>

                  {/* Package Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="package-type">Package Type</Label>
                      <Select value={shipmentData.packageType} onValueChange={(value) => setShipmentData({...shipmentData, packageType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select package type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="fragile">Fragile</SelectItem>
                          <SelectItem value="perishable">Perishable</SelectItem>
                          <SelectItem value="hazardous">Hazardous</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority Level</Label>
                      <Select value={shipmentData.priority} onValueChange={(value) => setShipmentData({...shipmentData, priority: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="driver">Assign Driver</Label>
                      <Select value={shipmentData.assignedDriver} onValueChange={(value) => setShipmentData({...shipmentData, assignedDriver: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select driver" />
                        </SelectTrigger>
                        <SelectContent>
                          {drivers.length > 0 ? (
                            drivers
                              .map((driver) => (
                                <SelectItem key={driver.driverId || driver.id} value={driver.driverId || driver.id}>
                                  {driver.name} (⭐ {driver.stats?.rating || 5.0}) - {driver.status}
                                </SelectItem>
                              ))
                          ) : (
                            <SelectItem value="no-drivers" disabled>
                              No drivers available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Delivery Destinations */}
                  <div>
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Delivery Route:</strong> Add multiple stops for your delivery. Enter addresses and click the map icon to automatically find coordinates.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      {destinations.map((destination, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Stop {index + 1}</h4>
                            {destinations.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeDestination(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor={`name-${index}`}>Location Name</Label>
                              <Input
                                id={`name-${index}`}
                                value={destination.name}
                                onChange={(e) => updateDestination(index, "name", e.target.value)}
                                placeholder="e.g., Customer Office, Warehouse, etc."
                                required
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor={`address-${index}`}>Address</Label>
                              <div className="flex gap-2">
                                <Input
                                  id={`address-${index}`}
                                  value={destination.address}
                                  onChange={(e) => updateDestination(index, "address", e.target.value)}
                                  placeholder="e.g., 123 Main St, Mumbai, India"
                                  required
                                  className="flex-1"
                                />
                                <Button
                                  type="button"
                                  onClick={() => geocodeAddress(index)}
                                  disabled={!destination.address.trim() || destination.isGeocoding}
                                  size="sm"
                                >
                                  {destination.isGeocoding ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <MapPin className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                              {destination.lat && destination.lng && (
                                <p className="text-xs text-green-600 mt-1">
                                  ✓ Coordinates found: {destination.lat}, {destination.lng}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addDestination}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Another Stop
                      </Button>
                    </div>
                  </div>

                  {/* Special Instructions */}
                    <div>
                      <Label htmlFor="notes">Special Instructions</Label>
                    <Input 
                      id="notes" 
                      value={shipmentData.notes}
                      onChange={(e) => setShipmentData({...shipmentData, notes: e.target.value})}
                      placeholder="Any special handling instructions" 
                    />
                    </div>

                  {/* Create Button */}
                    <div className="pt-4">
                    <Button 
                      onClick={createShipment}
                      disabled={isCreating}
                      className="w-full"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating Shipment...
                        </>
                      ) : (
                        <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Shipment
                        </>
                      )}
                      </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Export with dynamic import to prevent hydration issues
export default function SupplierDashboard() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return <SupplierDashboardContent />
}
