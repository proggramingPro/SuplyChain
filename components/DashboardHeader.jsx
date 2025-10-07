"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LogOut, Bell, Settings, X, AlertCircle, Package } from "lucide-react";

export function DashboardHeader({
  title,
  description,
  showAlerts = true,
  showSettings = true,
  showAvatar = true,
  alertsCount = 0,
  alerts = [],
  onClearAlert = () => {},
  onClearAllAlerts = () => {},
}) {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [category, setCategory] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem("token");
    const userCategory = localStorage.getItem("category");
    setLoggedIn(!!token);
    setCategory(userCategory);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("category");
    setLoggedIn(false);
    setCategory(null);
    router.push("/");
  };

  const handleLogin = () => {
    router.push("/login"); // redirect to login page
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>

        <div className="flex items-center gap-4">
          {isClient && (
            <>
              {loggedIn && showAlerts && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="relative">
                      <Bell className="h-4 w-4 mr-2" />
                      Alerts
                      {alertsCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                        >
                          {alertsCount}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-96 p-0" align="end">
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">Alerts</h3>
                        {alerts.length > 0 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={onClearAllAlerts}
                          >
                            Clear All
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {alerts.length > 0 ? (
                        <div className="space-y-2 p-2">
                          {alerts.map((alert) => (
                            <div
                              key={alert.id}
                              className={`p-3 rounded-lg border ${
                                alert.severity === "high"
                                  ? "border-red-200 bg-red-50"
                                  : alert.severity === "medium"
                                  ? "border-blue-200 bg-blue-50"
                                  : "border-green-200 bg-green-50"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <Package
                                  className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                                    alert.severity === "high"
                                      ? "text-red-600"
                                      : alert.severity === "medium"
                                      ? "text-blue-600"
                                      : "text-green-600"
                                  }`}
                                />
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`font-medium text-sm ${
                                      alert.severity === "high"
                                        ? "text-red-800"
                                        : alert.severity === "medium"
                                        ? "text-blue-800"
                                        : "text-green-800"
                                    }`}
                                  >
                                    {alert.type === "status_update"
                                      ? "Package Update"
                                      : alert.type === "shipment_update"
                                      ? "Shipment Update"
                                      : "Alert"}
                                  </p>
                                  <p
                                    className={`text-sm mt-1 ${
                                      alert.severity === "high"
                                        ? "text-red-700"
                                        : alert.severity === "medium"
                                        ? "text-blue-700"
                                        : "text-green-700"
                                    }`}
                                  >
                                    {alert.message}
                                  </p>
                                  {alert.timestamp && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      {alert.timestamp.toLocaleTimeString()}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onClearAlert(alert.id)}
                                  className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No alerts</p>
                          <p className="text-xs text-gray-400">Notifications will appear here</p>
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              )}

              {loggedIn && showSettings && (
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              )}

              {loggedIn ? (
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={handleLogin}>
                  Login
                </Button>
              )}

              {loggedIn && showAvatar && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
