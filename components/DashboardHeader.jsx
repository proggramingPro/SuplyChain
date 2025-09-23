"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Bell, Settings } from "lucide-react";

export function DashboardHeader({
  title,
  description,
  showAlerts = true,
  showSettings = true,
  showAvatar = true,
  alertsCount = 0,
}) {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [category, setCategory] = useState(null);

  useEffect(() => {
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
          {loggedIn && showAlerts && (
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Alerts
              {alertsCount > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-2 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {alertsCount}
                </Badge>
              )}
            </Button>
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
        </div>
      </div>
    </header>
  );
}
