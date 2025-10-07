"use client"

import { useState, useEffect, useRef } from "react"
import io from 'socket.io-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/DashboardHeader"
import {
  Package,
  MapPin,
  Clock,
  Search,
  Plus,
  Truck,
  CheckCircle,
  AlertCircle,
  Home,
} from "lucide-react"

export default function ConsumerDashboard() {
  const [activePackages, setActivePackages] = useState(0)
  const [deliveredThisMonth, setDeliveredThisMonth] = useState(0)
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [alertsCount, setAlertsCount] = useState(0)
  const socketRef = useRef(null)

  // Initialize WebSocket connection
  useEffect(() => {
    if (!isClient) return

    socketRef.current = io(process.env.NEXT_PUBLIC_WS_URL)
    
    socketRef.current.on('connect', () => {
      console.log('Consumer dashboard connected to WebSocket')
    })

    socketRef.current.on('delivery-status-update', (update) => {
      console.log('Consumer received delivery update:', update)
      setAlerts(prev => [...prev, {
        id: Date.now(),
        type: 'status_update',
        message: `Your package ${update.deliveryId} status updated to ${update.status}`,
        deliveryId: update.deliveryId,
        status: update.status,
        timestamp: new Date(update.timestamp),
        severity: update.status === 'delivered' ? 'low' : 'medium'
      }])
      setAlertsCount(prev => prev + 1)
    })

    socketRef.current.on('shipment-update', (update) => {
      console.log('Consumer received shipment update:', update)
      setAlerts(prev => [...prev, {
        id: Date.now(),
        type: 'shipment_update',
        message: `Package update: ${update.type.replace('_', ' ')}`,
        shipmentId: update.shipmentId,
        timestamp: new Date(update.timestamp),
        severity: 'medium'
      }])
      setAlertsCount(prev => prev + 1)
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [isClient])

  useEffect(() => {
    setIsClient(true)
    const fetchData = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No token found')
        setLoading(false)
        return
      }

      try {
        // Fetch deliveries, stats, and profile in parallel
        const [deliveriesResponse, statsResponse, profileResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/consumer/deliveries`, {
            headers: { 'authorization': token }
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/consumer/stats`, {
            headers: { 'authorization': token }
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/consumer/profile`, {
            headers: { 'authorization': token }
          })
        ]);

        if (deliveriesResponse.ok) {
          const data = await deliveriesResponse.json()
          console.log("Token from localStorage:", token)
          console.log("Fetched deliveries data:", data)

          // Map data to UI format
          const mappedPackages = data.map(delivery => ({
            id: delivery.orderId,
            name: `Package ${delivery.orderId}`,
            from: delivery.supplierName,
            status: delivery.currentStatus === 'pending' ? 'Pending' :
                    delivery.currentStatus === 'picked_up' ? 'Picked Up' :
                    delivery.currentStatus === 'departed' ? 'In Transit' :
                    delivery.currentStatus === 'delivered' ? 'Delivered' : delivery.currentStatus,
            progress: delivery.currentStatus === 'delivered' ? 100 :
                     delivery.currentStatus === 'pending' ? 10 :
                     delivery.currentStatus === 'picked_up' ? 25 :
                     delivery.currentStatus === 'departed' ? 75 : 50,
            currentLocation: delivery.currentLocation || delivery.origin?.name || 'In Transit',
            eta: delivery.estimatedDelivery ? new Date(delivery.estimatedDelivery).toLocaleDateString() : 'TBD',
            driver: delivery.driverId || 'Assigned',
            driverPhone: '',
            estimatedDelivery: delivery.estimatedDelivery
          }))

          setPackages(mappedPackages)
        } else {
          console.error('Failed to fetch deliveries:', deliveriesResponse.status)
        }

        if (statsResponse.ok) {
          const stats = await statsResponse.json()
          setActivePackages(stats.activePackages)
          setDeliveredThisMonth(stats.deliveredThisMonth)
        } else {
          console.error('Failed to fetch stats:', statsResponse.status)
        }

        if (profileResponse.ok) {
          const profile = await profileResponse.json()
          setUserProfile(profile)
        } else {
          console.error('Failed to fetch profile:', profileResponse.status)
        }
      } catch (error) {
        console.error('Error fetching deliveries:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const [addresses, setAddresses] = useState([])

  // Clear alert function
  const clearAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
    setAlertsCount(prev => Math.max(0, prev - 1))
  }

  const clearAllAlerts = () => {
    setAlerts([])
    setAlertsCount(0)
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DashboardHeader
        title="My Packages"
        description={userProfile ? `Welcome back, ${userProfile.name}` : "Track and manage your deliveries"}
        alertsCount={alertsCount}
        alerts={alerts}
        onClearAlert={clearAlert}
        onClearAllAlerts={clearAllAlerts}
      />

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
              <p className="text-xs text-gray-600">{deliveredThisMonth > 0 ? `${deliveredThisMonth} this month` : 'No deliveries this month'}</p>
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="packages">My Packages</TabsTrigger>
            <TabsTrigger value="track">Track Package</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
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
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Loading packages...</span>
                  </div>
                ) : packages.length > 0 ? (
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
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No packages yet</h3>
                    <p className="text-gray-600">You don't have any packages to track at the moment.</p>
                  </div>
                )}
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
                {addresses.length > 0 ? (
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
                ) : (
                  <div className="text-center py-8">
                    <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
                    <p className="text-gray-600">Add your first delivery address to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>




        </Tabs>
      </div>
    </div>
  )
}
