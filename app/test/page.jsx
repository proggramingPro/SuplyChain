"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TestPage() {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const runTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    const tests = [
      {
        name: "Test DRIVER001 Delivery",
        url: "http://localhost:5000/api/drivers/DRIVER001/current-shipment",
        expected: "Should return delivery data"
      },
      {
        name: "Test DRIVER002 Delivery", 
        url: "http://localhost:5000/api/drivers/DRIVER002/current-shipment",
        expected: "Should return different delivery data"
      },
      {
        name: "Test DRIVER003 Delivery",
        url: "http://localhost:5000/api/drivers/DRIVER003/current-shipment", 
        expected: "Should return different delivery data"
      },
      {
        name: "Test Backend Health",
        url: "http://localhost:5000/api/health",
        expected: "Should return health status"
      }
    ];

    for (const test of tests) {
      try {
        const response = await fetch(test.url);
        const data = await response.json();
        
        setTestResults(prev => [...prev, {
          name: test.name,
          status: response.ok ? "PASS" : "FAIL",
          data: data,
          expected: test.expected
        }]);
      } catch (error) {
        setTestResults(prev => [...prev, {
          name: test.name,
          status: "ERROR",
          error: error.message,
          expected: test.expected
        }]);
      }
    }
    
    setIsLoading(false);
  };

  const updateDriverLocation = async (driverId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/drivers/${driverId}/location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: 19.076 + Math.random() * 0.01,
          longitude: 72.8777 + Math.random() * 0.01,
          address: `Test Location for ${driverId}`
        })
      });
      
      const data = await response.json();
      console.log(`Updated location for ${driverId}:`, data);
    } catch (error) {
      console.error(`Failed to update location for ${driverId}:`, error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">System Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>API Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={runTests} disabled={isLoading} className="w-full">
                {isLoading ? "Running Tests..." : "Run All Tests"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location Tests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                onClick={() => updateDriverLocation("DRIVER001")} 
                className="w-full"
                variant="outline"
              >
                Update DRIVER001 Location
              </Button>
              <Button 
                onClick={() => updateDriverLocation("DRIVER002")} 
                className="w-full"
                variant="outline"
              >
                Update DRIVER002 Location
              </Button>
              <Button 
                onClick={() => updateDriverLocation("DRIVER003")} 
                className="w-full"
                variant="outline"
              >
                Update DRIVER003 Location
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            {testResults.length === 0 ? (
              <p className="text-gray-500">No tests run yet. Click "Run All Tests" to start.</p>
            ) : (
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{result.name}</h3>
                      <Badge 
                        variant={result.status === "PASS" ? "default" : "destructive"}
                      >
                        {result.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{result.expected}</p>
                    {result.error ? (
                      <p className="text-sm text-red-600">Error: {result.error}</p>
                    ) : (
                      <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <div className="flex gap-4">
            <Button asChild>
              <a href="/driver/dashboard?driverId=DRIVER001">DRIVER001 Dashboard</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/driver/dashboard?driverId=DRIVER002">DRIVER002 Dashboard</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/driver/dashboard?driverId=DRIVER003">DRIVER003 Dashboard</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


