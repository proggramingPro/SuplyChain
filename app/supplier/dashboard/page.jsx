"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "lucide-react"

export default function SupplierDashboard() {
  const [activeShipments, setActiveShipments] = useState(12)
  const [completedToday, setCompletedToday] = useState(8)
  const [delayedShipments, setDelayedShipments] = useState(3)

  const shipments = [
    {
      id: "SH001",
      customer: "TechCorp Inc.",
      destination: "New York, NY",
      driver: "John Smith",
      status: "In Transit",
      progress: 65,
      eta: "2 hours",
      risk: "Low",
    },
    {
      id: "SH002",
      customer: "Global Retail",
      destination: "Los Angeles, CA",
      driver: "Maria Garcia",
      status: "Delayed",
      progress: 40,
      eta: "4 hours",
      risk: "High",
    },
    {
      id: "SH003",
      customer: "MedSupply Co.",
      destination: "Chicago, IL",
      driver: "David Wilson",
      status: "Delivered",
      progress: 100,
      eta: "Completed",
      risk: "Low",
    },
  ]

  const drivers = [
    { id: 1, name: "John Smith", status: "Active", rating: 4.8, deliveries: 156 },
    { id: 2, name: "Maria Garcia", status: "Active", rating: 4.9, deliveries: 203 },
    { id: 3, name: "David Wilson", status: "Offline", rating: 4.7, deliveries: 189 },
    { id: 4, name: "Sarah Johnson", status: "Active", rating: 4.6, deliveries: 134 },
  ]

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
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
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
                <div className="space-y-4">
                  {shipments.map((shipment) => (
                    <div key={shipment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="font-semibold text-lg">{shipment.id}</div>
                          <Badge
                            variant={
                              shipment.status === "Delivered"
                                ? "default"
                                : shipment.status === "Delayed"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {shipment.status}
                          </Badge>
                          <Badge variant={shipment.risk === "High" ? "destructive" : "outline"}>
                            {shipment.risk} Risk
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Customer</div>
                          <div className="font-medium">{shipment.customer}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Destination</div>
                          <div className="font-medium flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {shipment.destination}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Driver</div>
                          <div className="font-medium">{shipment.driver}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">ETA</div>
                          <div className="font-medium flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {shipment.eta}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{shipment.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${shipment.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Drivers Tab */}
          <TabsContent value="drivers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Driver Management</CardTitle>
                <CardDescription>Monitor driver performance and availability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {drivers.map((driver) => (
                    <div key={driver.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-semibold">{driver.name}</div>
                        <Badge variant={driver.status === "Active" ? "default" : "secondary"}>{driver.status}</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rating</span>
                          <span className="font-medium">⭐ {driver.rating}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Deliveries</span>
                          <span className="font-medium">{driver.deliveries}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent">
                        Assign Shipment
                      </Button>
                    </div>
                  ))}
                </div>
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
                <CardDescription>Set up a new delivery with driver assignment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="customer">Customer Name</Label>
                      <Input id="customer" placeholder="Enter customer name" />
                    </div>
                    <div>
                      <Label htmlFor="pickup">Pickup Address</Label>
                      <Input id="pickup" placeholder="Enter pickup location" />
                    </div>
                    <div>
                      <Label htmlFor="destination">Destination Address</Label>
                      <Input id="destination" placeholder="Enter destination" />
                    </div>
                    <div>
                      <Label htmlFor="package-type">Package Type</Label>
                      <Select>
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
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="driver">Assign Driver</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select driver" />
                        </SelectTrigger>
                        <SelectContent>
                          {drivers
                            .filter((d) => d.status === "Active")
                            .map((driver) => (
                              <SelectItem key={driver.id} value={driver.id.toString()}>
                                {driver.name} (⭐ {driver.rating})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority Level</Label>
                      <Select>
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
                      <Label htmlFor="notes">Special Instructions</Label>
                      <Input id="notes" placeholder="Any special handling instructions" />
                    </div>
                    <div className="pt-4">
                      <Button className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Shipment
                      </Button>
                    </div>
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
