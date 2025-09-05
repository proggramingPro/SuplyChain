"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Plus, X, Loader2 } from "lucide-react";

export default function SupplierDestinationForm({ onDestinationSubmit }) {
  const [destinations, setDestinations] = useState([
    { name: "", address: "", lat: "", lng: "", isGeocoding: false }
  ]);

  const addDestination = () => {
    setDestinations([...destinations, { name: "", address: "", lat: "", lng: "", isGeocoding: false }]);
  };

  const removeDestination = (index) => {
    if (destinations.length > 1) {
      setDestinations(destinations.filter((_, i) => i !== index));
    }
  };

  const updateDestination = (index, field, value) => {
    const updated = [...destinations];
    updated[index][field] = value;
    setDestinations(updated);
  };

  const geocodeAddress = async (index) => {
    const destination = destinations[index];
    if (!destination.address.trim()) return;

    const updated = [...destinations];
    updated[index].isGeocoding = true;
    setDestinations(updated);

    try {
      const response = await fetch(
        `http://localhost:5000/api/geocode?address=${encodeURIComponent(destination.address)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        updated[index] = {
          ...updated[index],
          lat: data.lat.toString(),
          lng: data.lng.toString(),
          name: data.formatted.name,
          address: data.formatted.address,
          isGeocoding: false
        };
      } else {
        throw new Error("Geocoding failed");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      updated[index].isGeocoding = false;
      alert(`Failed to find coordinates for: ${destination.address}`);
    }

    setDestinations(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validDestinations = destinations.filter(dest => 
      dest.name && dest.address && dest.lat && dest.lng
    );
    
    if (validDestinations.length > 0) {
      onDestinationSubmit(validDestinations);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Add Delivery Destinations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>How to use:</strong> Enter a location name and address, then click the map icon to automatically find coordinates. 
            You can add multiple stops for your delivery route.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {destinations.map((destination, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Destination {index + 1}</h4>
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
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={addDestination}
              className="flex-1"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Destination
            </Button>
            
            <Button type="submit" className="flex-1">
              Create Delivery Route
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
