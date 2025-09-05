"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, Clock, User, Truck } from "lucide-react";
import SupplierDestinationForm from "@/components/SupplierDestinationForm";

export default function SupplierPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  const handleDestinationSubmit = async (destinations) => {
    try {
      setIsCreating(true);
      
      // Create delivery with checkpoints
      const deliveryData = {
        customerName: "John Doe",
        customerPhone: "+91 98765 43210",
        supplierName: "TechMart Supply",
        orderId: `ORD-${Date.now()}`,
        origin: {
          name: "TechMart Warehouse, Mumbai",
          lat: 19.076,
          lng: 72.8777,
          address: "TechMart Warehouse, Mumbai"
        },
        destination: destinations[destinations.length - 1], // Last destination
        checkpoints: destinations.map((dest, index) => ({
          id: `cp-${Date.now()}-${index}`,
          name: dest.name,
          location: {
            lat: parseFloat(dest.lat),
            lng: parseFloat(dest.lng),
            address: dest.address
          },
          status: "pending",
          order: index,
          estimatedArrival: new Date(Date.now() + (index + 1) * 30 * 60 * 1000) // 30 min intervals
        })),
        currentStatus: "pending",
        estimatedDelivery: new Date(Date.now() + destinations.length * 30 * 60 * 1000),
        totalDistance: destinations.length * 50, // Rough estimate
        remainingTime: destinations.length * 30
      };

      const response = await fetch("http://localhost:5000/api/deliveries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deliveryData)
      });

      if (response.ok) {
        const newDelivery = await response.json();
        setDeliveries([newDelivery, ...deliveries]);
        alert("Delivery created successfully!");
      } else {
        throw new Error("Failed to create delivery");
      }
    } catch (error) {
      console.error("Error creating delivery:", error);
      alert("Failed to create delivery");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Supplier Dashboard
          </h1>
          <p className="text-gray-600">
            Create delivery routes by entering addresses - coordinates will be found automatically
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create New Delivery */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Create New Delivery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SupplierDestinationForm 
                  onDestinationSubmit={handleDestinationSubmit}
                />
                {isCreating && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">Creating delivery...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Active Deliveries */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Active Deliveries
                </CardTitle>
              </CardHeader>
              <CardContent>
                {deliveries.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No active deliveries</p>
                    <p className="text-sm text-gray-500">
                      Create a new delivery to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {deliveries.map((delivery) => (
                      <div key={delivery._id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{delivery.orderId}</h4>
                          <Badge
                            variant={
                              delivery.currentStatus === "delivered"
                                ? "default"
                                : delivery.currentStatus === "picked_up"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {delivery.currentStatus}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{delivery.customerName}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{delivery.destination.name}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              ETA: {new Date(delivery.estimatedDelivery).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <p className="text-xs text-gray-500">
                            {delivery.checkpoints?.length || 0} checkpoints
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}