"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Truck,
  Package,
  Users,
  MapPin,
  BarChart3,
  Settings,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default function NavigationPage() {
  const navigationItems = [
    {
      title: "Driver Dashboard",
      description: "View and manage driver activities",
      icon: Truck,
      href: "/driver/dashboard",
      color: "bg-blue-500",
      features: ["Live tracking", "Delivery status", "Quick actions"],
    },
    {
      title: "All Drivers",
      description: "Monitor all drivers in your fleet",
      icon: Users,
      href: "/drivers",
      color: "bg-green-500",
      features: ["Driver status", "Performance metrics", "Quick access"],
    },
    {
      title: "Supplier Dashboard",
      description: "Manage shipments and deliveries",
      icon: Package,
      href: "/supplier/dashboard",
      color: "bg-purple-500",
      features: ["Create shipments", "Track deliveries", "Manage drivers"],
    },
    {
      title: "Create Delivery",
      description: "Quick delivery creation",
      icon: MapPin,
      href: "/supplier",
      color: "bg-orange-500",
      features: ["Address geocoding", "Multi-stop routes", "Driver assignment"],
    },
  ];

  const driverOptions = [
    { id: "DRIVER001", name: "John Smith", status: "online" },
    { id: "DRIVER002", name: "Sarah Johnson", status: "offline" },
    { id: "DRIVER003", name: "Mike Wilson", status: "online" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Supply Chain Management
          </h1>
          <p className="text-xl text-gray-600">
            Choose your role and access the appropriate dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Card key={item.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${item.color} text-white`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">
                        Features:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {item.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button asChild className="w-full">
                      <Link href={item.href}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Access Dashboard
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Quick Driver Access
            </CardTitle>
            <p className="text-gray-600">
              Direct links to specific driver dashboards
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {driverOptions.map((driver) => (
                <div
                  key={driver.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        driver.status === "online" ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                    <div>
                      <p className="font-medium">{driver.name}</p>
                      <p className="text-sm text-gray-500">{driver.id}</p>
                    </div>
                  </div>
                  <Button size="sm" asChild>
                    <Link href={`/driver/dashboard?driverId=${driver.id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              System Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">3</div>
                <div className="text-sm text-gray-600">Active Drivers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">12</div>
                <div className="text-sm text-gray-600">Active Deliveries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">98%</div>
                <div className="text-sm text-gray-600">On-time Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


