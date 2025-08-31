"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Package,
  MapPin,
  Clock,
  Bell,
  Settings,
  Search,
  Plus,
  Truck,
  CheckCircle,
  AlertCircle,
  Home,
} from "lucide-react"

export default function ConsumerDashboard() {
  const [activePackages, setActivePackages] = useState(3)
  const [deliveredThisMonth, setDeliveredThisMonth] = useState(12)

  const packages = [
    {
      id: "TRK001234",
      name: "Electronics Package",
      from: "TechCorp Inc.",
      status: "In Transit",
      progress: 75,
      currentLocation: "Distribution Center - Chicago",
      eta: "Tomorrow, 2:30 PM",
      driver: "John Smith",
      driverPhone: "+1 (555) 123-4567",
      estimatedDelivery: "Dec 15, 2024",
    },
    {
      id: "TRK001235",
      name: "Home Essentials",
      from: "Global Retail",
      status: "Out for Delivery",
      progress: 90,
      currentLocation: "Local Delivery Hub",
      eta: "Today, 4:00 PM",
      driver: "Maria Garcia",
      driverPhone: "+1 (555) 987-6543",
      estimatedDelivery: "Dec 12, 2024",
    },
    {
      id: "TRK001236",
      name: "Medical Supplies",
      from: "MedSupply Co.",
      status: "Delivered",
      progress: 100,
      currentLocation: "Delivered to Front Door",
      eta: "Completed",
      driver: "David Wilson",
      driverPhone: "+1 (555) 456-7890",
      estimatedDelivery: "Dec 10, 2024",
    },
  ]

  const addresses = [
    {
      id: 1,
      type: "Home",
      address: "123 Main Street, Apt 4B",
      city: "New York, NY 10001",
      isDefault: true,
    },
    {
      id: 2,
      type: "Work",
      address: "456 Business Ave, Suite 200",
      city: "New York, NY 10002",
      isDefault: false,
    },
  ]

  const notifications = [
    {
      id: 1,
      type: "delivery",
      message: "Your package TRK001235 is out for delivery",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "delivered",
      message: "Package TRK001236 has been delivered successfully",
      time: "1 day ago",
      read: true,
    },
    {
      id: 3,
      type: "delay",
      message: "Package TRK001234 may be delayed due to weather",
      time: "2 days ago",
      read: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Packages</h1>
            <p className="text-gray-600">Track and manage your deliveries</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
              {notifications.filter((n) => !n.read).length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                  {notifications.filter((n) => !n.read).length}
                </Badge>
              )}
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Packages</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activePackages}</div>
              <p className="text-xs text-gray-600">Currently in transit</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered This Month</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deliveredThisMonth}</div>
              <p className="text-xs text-gray-600">+3 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Delivery Time</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.1 days</div>
              <p className="text-xs text-gray-600">Faster than average</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="packages" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="packages">My Packages</TabsTrigger>
            <TabsTrigger value="track">Track Package</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          {/* Packages Tab */}
          <TabsContent value="packages" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Package History</CardTitle>
                    <CardDescription>View all your current and past deliveries</CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search packages..." className="pl-10 w-64" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{pkg.name}</h3>
                            <Badge
                              variant={
                                pkg.status === "Delivered"
                                  ? "default"
                                  : pkg.status === "Out for Delivery"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {pkg.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600">From: {pkg.from}</p>
                          <p className="text-sm text-gray-500">Tracking: {pkg.id}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-600">Current Location</div>
                          <div className="font-medium flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-blue-600" />
                            {pkg.currentLocation}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Estimated Delivery</div>
                          <div className="font-medium flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-green-600" />
                            {pkg.eta}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Driver</div>
                          <div className="font-medium flex items-center">
                            <Truck className="h-4 w-4 mr-1 text-gray-600" />
                            {pkg.driver}
                          </div>
                        </div>
                      </div>

                      {pkg.status !== "Delivered" && (
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span>Delivery Progress</span>
                            <span>{pkg.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${pkg.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {pkg.status === "Out for Delivery" && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center">
                            <Truck className="h-5 w-5 text-green-600 mr-2" />
                            <div>
                              <p className="font-medium text-green-800">Out for delivery today!</p>
                              <p className="text-sm text-green-600">
                                Driver {pkg.driver} will deliver between 2:00 PM - 6:00 PM
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Track Package Tab */}
          <TabsContent value="track" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Track a Package</CardTitle>
                <CardDescription>Enter your tracking number to get real-time updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <Input placeholder="Enter tracking number (e.g., TRK001234)" className="flex-1" />
                  <Button>
                    <Search className="h-4 w-4 mr-2" />
                    Track Package
                  </Button>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Enter a tracking number</h3>
                  <p className="text-gray-600">
                    Enter your tracking number above to see detailed delivery information and real-time updates.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Delivery Addresses</CardTitle>
                    <CardDescription>Manage your saved delivery locations</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Home className="h-5 w-5 text-gray-600 mt-1" />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{address.type}</span>
                              {address.isDefault && <Badge variant="secondary">Default</Badge>}
                            </div>
                            <p className="text-gray-600">{address.address}</p>
                            <p className="text-gray-600">{address.city}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          {!address.isDefault && (
                            <Button variant="outline" size="sm">
                              Set Default
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="John Doe" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <Button>Update Profile</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to receive updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-gray-600">Receive updates via email</div>
                    </div>
                    <Button variant="outline" size="sm">
                      Enabled
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">SMS Notifications</div>
                      <div className="text-sm text-gray-600">Receive updates via text message</div>
                    </div>
                    <Button variant="outline" size="sm">
                      Enabled
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Push Notifications</div>
                      <div className="text-sm text-gray-600">Receive browser notifications</div>
                    </div>
                    <Button variant="outline" size="sm">
                      Disabled
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent package tracking activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                      <div className="mt-1">
                        {notification.type === "delivery" && <Truck className="h-4 w-4 text-blue-600" />}
                        {notification.type === "delivered" && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {notification.type === "delay" && <AlertCircle className="h-4 w-4 text-red-600" />}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${!notification.read ? "font-medium" : ""}`}>{notification.message}</p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                      {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
