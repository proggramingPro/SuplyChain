"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  Package,
  Truck,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Settings,
  Download,
  Filter,
  Search,
  Bell,
} from "lucide-react"

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(1247)
  const [activeShipments, setActiveShipments] = useState(89)
  const [totalDrivers, setTotalDrivers] = useState(156)
  const [systemHealth, setSystemHealth] = useState(98.7)

  const recentActivity = [
    {
      id: 1,
      type: "shipment",
      message: "New shipment created by TechCorp Inc.",
      time: "2 minutes ago",
      severity: "info",
    },
    {
      id: 2,
      type: "alert",
      message: "Driver John Smith reported traffic delay",
      time: "15 minutes ago",
      severity: "warning",
    },
    {
      id: 3,
      type: "delivery",
      message: "Package TRK001236 delivered successfully",
      time: "1 hour ago",
      severity: "success",
    },
    {
      id: 4,
      type: "user",
      message: "New supplier registered: Global Logistics",
      time: "2 hours ago",
      severity: "info",
    },
  ]

  const topSuppliers = [
    { name: "TechCorp Inc.", shipments: 234, revenue: "$45,600", growth: "+12%" },
    { name: "Global Retail", shipments: 189, revenue: "$38,200", growth: "+8%" },
    { name: "MedSupply Co.", shipments: 156, revenue: "$31,800", growth: "+15%" },
    { name: "AutoParts Ltd.", shipments: 134, revenue: "$28,900", growth: "+5%" },
  ]

  const topDrivers = [
    { name: "John Smith", deliveries: 156, rating: 4.9, efficiency: "98%" },
    { name: "Maria Garcia", deliveries: 203, rating: 4.8, efficiency: "96%" },
    { name: "David Wilson", deliveries: 189, rating: 4.7, efficiency: "94%" },
    { name: "Sarah Johnson", deliveries: 134, rating: 4.6, efficiency: "92%" },
  ]

  const systemMetrics = [
    { name: "API Response Time", value: "245ms", status: "good", trend: "down" },
    { name: "Database Performance", value: "99.2%", status: "excellent", trend: "up" },
    { name: "Server Uptime", value: "99.9%", status: "excellent", trend: "stable" },
    { name: "Error Rate", value: "0.03%", status: "good", trend: "down" },
  ]

  const riskAlerts = [
    {
      id: 1,
      type: "weather",
      message: "Severe weather affecting 12 shipments in Chicago area",
      severity: "high",
      affected: 12,
    },
    {
      id: 2,
      type: "traffic",
      message: "Heavy traffic delays on I-95 corridor",
      severity: "medium",
      affected: 8,
    },
    {
      id: 3,
      type: "vehicle",
      message: "Vehicle maintenance required for 3 trucks",
      severity: "low",
      affected: 3,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">System overview and management</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Alerts
              <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                3
              </Badge>
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeShipments}</div>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
              <Truck className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDrivers}</div>
              <p className="text-xs text-red-600 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                -3% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemHealth}%</div>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                All systems operational
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system events and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                        <div className="mt-1">
                          {activity.type === "shipment" && <Package className="h-4 w-4 text-blue-600" />}
                          {activity.type === "alert" && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                          {activity.type === "delivery" && <Truck className="h-4 w-4 text-green-600" />}
                          {activity.type === "user" && <Users className="h-4 w-4 text-purple-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                        <Badge
                          variant={
                            activity.severity === "warning"
                              ? "destructive"
                              : activity.severity === "success"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {activity.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Risk Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Alerts</CardTitle>
                  <CardDescription>Current system risks and warnings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {riskAlerts.map((alert) => (
                      <div key={alert.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <AlertTriangle
                              className={`h-4 w-4 ${
                                alert.severity === "high"
                                  ? "text-red-600"
                                  : alert.severity === "medium"
                                    ? "text-yellow-600"
                                    : "text-blue-600"
                              }`}
                            />
                            <Badge
                              variant={
                                alert.severity === "high"
                                  ? "destructive"
                                  : alert.severity === "medium"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {alert.severity}
                            </Badge>
                          </div>
                          <span className="text-sm text-gray-600">{alert.affected} affected</span>
                        </div>
                        <p className="text-sm font-medium">{alert.message}</p>
                        <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Suppliers</CardTitle>
                  <CardDescription>Suppliers by shipment volume and revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topSuppliers.map((supplier, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{supplier.name}</div>
                          <div className="text-sm text-gray-600">{supplier.shipments} shipments</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{supplier.revenue}</div>
                          <div className="text-sm text-green-600">{supplier.growth}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Drivers</CardTitle>
                  <CardDescription>Drivers by delivery count and ratings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topDrivers.map((driver, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{driver.name}</div>
                          <div className="text-sm text-gray-600">{driver.deliveries} deliveries</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">⭐ {driver.rating}</div>
                          <div className="text-sm text-blue-600">{driver.efficiency} efficiency</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage suppliers, drivers, and consumers</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search users..." className="pl-10 w-64" />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Suppliers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">247</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Active</span>
                          <span className="font-medium">234</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Inactive</span>
                          <span className="font-medium">13</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full mt-4 bg-transparent">
                        Manage Suppliers
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Drivers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">156</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Online</span>
                          <span className="font-medium">89</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Offline</span>
                          <span className="font-medium">67</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full mt-4 bg-transparent">
                        Manage Drivers
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Consumers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">844</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Active</span>
                          <span className="font-medium">756</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Inactive</span>
                          <span className="font-medium">88</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full mt-4 bg-transparent">
                        Manage Consumers
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                  <CardDescription>Financial performance overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Total Revenue (This Month)</span>
                      <span className="text-2xl font-bold">$156,780</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Average Revenue per Shipment</span>
                      <span className="font-medium">$45.60</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Growth Rate</span>
                      <span className="font-medium text-green-600">+12.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Operational Metrics</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Average Delivery Time</span>
                      <span className="font-medium">2.4 hours</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>On-Time Delivery Rate</span>
                      <span className="font-medium text-green-600">94.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Customer Satisfaction</span>
                      <span className="font-medium">4.7/5.0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Health Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>Real-time system health monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {systemMetrics.map((metric, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{metric.name}</span>
                        <Badge
                          variant={
                            metric.status === "excellent"
                              ? "default"
                              : metric.status === "good"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {metric.status}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold mb-1">{metric.value}</div>
                      <div className="flex items-center text-sm text-gray-600">
                        {metric.trend === "up" && <TrendingUp className="h-3 w-3 mr-1 text-green-600" />}
                        {metric.trend === "down" && <TrendingDown className="h-3 w-3 mr-1 text-red-600" />}
                        {metric.trend === "stable" && <Activity className="h-3 w-3 mr-1 text-blue-600" />}
                        Trend: {metric.trend}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Generate Reports</CardTitle>
                    <CardDescription>Create custom reports for analysis</CardDescription>
                  </div>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Export All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Delivery Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Comprehensive delivery metrics and performance analysis
                      </p>
                      <Button variant="outline" className="w-full bg-transparent">
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Financial Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">Revenue, costs, and profitability analysis</p>
                      <Button variant="outline" className="w-full bg-transparent">
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">User Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">User engagement and platform usage statistics</p>
                      <Button variant="outline" className="w-full bg-transparent">
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
