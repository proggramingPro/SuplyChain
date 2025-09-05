"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  MapPin,
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default function DriversPage() {
  const [drivers, setDrivers] = useState([
    {
      id: "DRIVER001",
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
      status: "online",
      currentDelivery: "Delivery #12345",
      location: "Downtown Area",
      rating: 4.8,
      totalDeliveries: 156,
      onTimeRate: 94,
    },
    {
      id: "DRIVER002", 
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "+1 (555) 234-5678",
      status: "offline",
      currentDelivery: null,
      location: "Not available",
      rating: 4.6,
      totalDeliveries: 89,
      onTimeRate: 91,
    },
    {
      id: "DRIVER003",
      name: "Mike Wilson", 
      email: "mike.wilson@example.com",
      phone: "+1 (555) 345-6789",
      status: "online",
      currentDelivery: "Delivery #12346",
      location: "Airport District",
      rating: 4.9,
      totalDeliveries: 203,
      onTimeRate: 96,
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-gray-400";
      case "busy":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "online":
        return "Online";
      case "offline":
        return "Offline";
      case "busy":
        return "Busy";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Driver Management
          </h1>
          <p className="text-gray-600">
            Monitor and manage all drivers in your fleet
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers.map((driver) => (
            <Card key={driver.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/avatars/${driver.id}.jpg`} />
                      <AvatarFallback>
                        {driver.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{driver.name}</CardTitle>
                      <p className="text-sm text-gray-500">{driver.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${getStatusColor(driver.status)}`}
                    />
                    <span className="text-sm text-gray-600">
                      {getStatusText(driver.status)}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Current Delivery:</span>
                    <span className="font-medium">
                      {driver.currentDelivery || "None"}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{driver.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Total Deliveries:</span>
                    <span className="font-medium">{driver.totalDeliveries}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">
                      {driver.onTimeRate}% on-time
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">⭐ {driver.rating}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    asChild
                    size="sm"
                    className="flex-1"
                    variant="outline"
                  >
                    <Link href={`/driver/dashboard?driverId=${driver.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Dashboard
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="flex-1"
                  >
                    <Link href={`/driver/dashboard?driverId=${driver.id}`} target="_blank">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/supplier/dashboard">
                Manage Drivers
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/supplier/dashboard?tab=create">
                Create New Delivery
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


