"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "lucide-react"

// Mock delivery data
const currentDelivery = {
  id: "DEL-2024-001",
  packageId: "PKG-789",
  from: "Warehouse A, Mumbai",
  to: "Customer Location, Pune",
  customerName: "Rajesh Kumar",
  customerPhone: "+91 98765 43210",
  estimatedTime: "2h 30m",
  distance: "148 km",
  status: "in_transit",
  checkpoints: [
    { id: 1, name: "Warehouse A", status: "completed", time: "09:00 AM" },
    { id: 2, name: "Highway Toll", status: "completed", time: "10:15 AM" },
    { id: 3, name: "Rest Stop", status: "current", time: "11:30 AM" },
    { id: 4, name: "City Entry", status: "pending", time: "12:45 PM" },
    { id: 5, name: "Customer Location", status: "pending", time: "01:30 PM" },
  ],
}

const driverStats = {
  rating: 4.8,
  totalDeliveries: 156,
  onTimeRate: 94,
  todayDeliveries: 3,
  weeklyEarnings: 2850,
}

const recentDeliveries = [
  { id: "DEL-001", customer: "Tech Corp", status: "Delivered", time: "2 hours ago", rating: 5 },
  { id: "DEL-002", customer: "Global Retail", status: "Delivered", time: "4 hours ago", rating: 4 },
  { id: "DEL-003", customer: "Med Supply", status: "Delivered", time: "Yesterday", rating: 5 },
]

const alerts = [
  { type: "weather", message: "Heavy rain expected in 30 minutes", severity: "medium" },
  { type: "traffic", message: "Traffic jam ahead on NH-48", severity: "low" },
  { type: "fuel", message: "Fuel level at 25%. Consider refueling", severity: "high" },
]

export default function DriverDashboard() {
  const [currentLocation, setCurrentLocation] = useState({ lat: 19.076, lng: 72.8777 })
  const [isTracking, setIsTracking] = useState(true)
  const [deliveryProgress, setDeliveryProgress] = useState(60)
  const [activeTab, setActiveTab] = useState("current")
  const [notifications, setNotifications] = useState(3)

  const handleStatusUpdate = (status) => {
    console.log(`[v0] Status updated to: ${status}`)
    // Here you would typically make an API call to update the status
  }

  const handleCheckpointReached = (checkpointId) => {
    console.log(`[v0] Checkpoint ${checkpointId} reached`)
    // Update checkpoint status and progress
  }

  const handleEmergency = () => {
    console.log("[v0] Emergency button pressed")
    // Trigger emergency protocol
  }

  const handleNavigation = () => {
    console.log("[v0] Opening navigation")
    // Open navigation app or internal navigation
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">Driver Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{driverStats.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="font-medium">{driverStats.onTimeRate}%</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
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
          {/* Map Container */}
          <div className="h-full bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden">
            {/* Mock Map Interface */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full max-w-4xl max-h-96 bg-white rounded-lg shadow-lg m-4">
                {/* Map Header */}
                <div className="absolute top-4 left-4 right-4 z-10">
                  <Card className="bg-white/95 backdrop-blur-sm">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium">Live Tracking Active</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-blue-50">
                            <Fuel className="h-3 w-3 mr-1" />
                            75%
                          </Badge>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            {currentDelivery.estimatedTime} ETA
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Mock Map Visual */}
                <div className="w-full h-full bg-gradient-to-br from-blue-100 via-green-50 to-yellow-50 rounded-lg relative">
                  {/* Route Line */}
                  <svg className="absolute inset-0 w-full h-full">
                    <path
                      d="M 50 300 Q 200 200 350 150 Q 500 100 650 120"
                      stroke="#3b82f6"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray="10,5"
                      className="animate-pulse"
                    />
                  </svg>

                  {/* Starting Point */}
                  <div className="absolute top-72 left-12 flex flex-col items-center">
                    <div className="w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
                    <div className="mt-2 bg-white px-2 py-1 rounded shadow text-xs font-medium">Start: Mumbai</div>
                  </div>

                  {/* Current Location */}
                  <div className="absolute top-40 left-80 flex flex-col items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full border-4 border-white shadow-lg animate-pulse flex items-center justify-center">
                      <Navigation className="h-4 w-4 text-white" />
                    </div>
                    <div className="mt-2 bg-blue-500 text-white px-2 py-1 rounded shadow text-xs font-medium">
                      You are here
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="absolute top-32 right-16 flex flex-col items-center">
                    <div className="w-6 h-6 bg-red-500 rounded-full border-4 border-white shadow-lg"></div>
                    <div className="mt-2 bg-white px-2 py-1 rounded shadow text-xs font-medium">End: Pune</div>
                  </div>

                  {/* Checkpoints */}
                  <div className="absolute top-52 left-48 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow"></div>
                  <div className="absolute top-44 left-64 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow"></div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="absolute bottom-4 left-4 flex flex-col gap-2">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Picked Up
              </Button>
              <Button size="sm" variant="outline" onClick={handleNavigation}>
                <Route className="h-4 w-4 mr-2" />
                Navigate
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Package className="h-4 w-4 mr-2" />
                Delivered
              </Button>
            </div>

            {/* Emergency Button */}
            <div className="absolute bottom-4 right-4">
              <Button size="sm" variant="destructive" className="bg-red-600 hover:bg-red-700" onClick={handleEmergency}>
                <Shield className="h-4 w-4 mr-2" />
                Emergency
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-96 bg-white border-l overflow-y-auto">
          <div className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="current">Current</TabsTrigger>
                <TabsTrigger value="stats">Stats</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              {/* Current Delivery Tab */}
              <TabsContent value="current" className="space-y-4">
                {/* Current Delivery Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Current Delivery</CardTitle>
                      <Badge className="bg-blue-100 text-blue-700">In Transit</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">From</p>
                          <p className="text-sm text-gray-600">{currentDelivery.from}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">To</p>
                          <p className="text-sm text-gray-600">{currentDelivery.to}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{deliveryProgress}%</span>
                      </div>
                      <Progress value={deliveryProgress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Distance</p>
                        <p className="font-medium">{currentDelivery.distance}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">ETA</p>
                        <p className="font-medium">{currentDelivery.estimatedTime}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Info */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Customer Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-medium">{currentDelivery.customerName}</p>
                      <p className="text-sm text-gray-600">{currentDelivery.customerPhone}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Checkpoints */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Delivery Checkpoints</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentDelivery.checkpoints.map((checkpoint, index) => (
                        <div key={checkpoint.id} className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                              checkpoint.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : checkpoint.status === "current"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {checkpoint.status === "completed" ? <CheckCircle className="h-4 w-4" /> : index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{checkpoint.name}</p>
                            <p className="text-xs text-gray-600">{checkpoint.time}</p>
                          </div>
                          {checkpoint.status === "current" && (
                            <Button
                              size="sm"
                              onClick={() => handleCheckpointReached(checkpoint.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Reached
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => handleStatusUpdate("picked_up")}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Mark as Picked Up
                    </Button>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleStatusUpdate("departed")}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Departed from Location
                    </Button>
                    <Button
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      onClick={() => handleStatusUpdate("delivered")}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Delivered
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => handleStatusUpdate("photo_proof")}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Add Photo Proof
                    </Button>
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
                          <div>
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
                                  : "Fuel Alert"}
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
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Driver Statistics Tab */}
              <TabsContent value="stats" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Today's Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{driverStats.todayDeliveries}</div>
                        <div className="text-sm text-gray-600">Deliveries</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">₹{driverStats.weeklyEarnings}</div>
                        <div className="text-sm text-gray-600">Weekly Earnings</div>
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
                        <span className="font-medium">{driverStats.rating}/5.0</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Deliveries</span>
                      <span className="font-medium">{driverStats.totalDeliveries}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">On-Time Rate</span>
                      <span className="font-medium text-green-600">{driverStats.onTimeRate}%</span>
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
                      {recentDeliveries.map((delivery) => (
                        <div key={delivery.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium text-sm">{delivery.id}</div>
                            <div className="text-sm text-gray-600">{delivery.customer}</div>
                            <div className="text-xs text-gray-500">{delivery.time}</div>
                          </div>
                          <div className="text-right">
                            <Badge variant="default" className="mb-1">
                              {delivery.status}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span className="text-xs">{delivery.rating}</span>
                            </div>
                          </div>
                        </div>
                      ))}
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
                        <span className="text-sm">Completed Deliveries</span>
                        <span className="font-medium">23</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Distance Covered</span>
                        <span className="font-medium">1,247 km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Average Rating</span>
                        <span className="font-medium">4.8/5.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Earnings</span>
                        <span className="font-medium text-green-600">₹2,850</span>
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
  )
}
