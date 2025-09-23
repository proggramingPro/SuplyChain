"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Truck,
  MapPin,
  Shield,
  BarChart3,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
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

  const handleGetStarted = () => {
    router.push("/signup");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleDashboard = () => {
    if (category === "consumer") {
      router.push("/consumer/dashboard");
    } else if (category === "supplier") {
      router.push("/supplier/dashboard");
    } else if (category === "driver") {
      router.push("/drivers/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href={"/"}>
            <div className="flex items-center gap-3 cursor-pointer">
              <Truck className="h-10 w-10 text-blue-600 animate-bounce" />
              <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                SupplyTrack Pro
              </h1>
            </div>
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {!loggedIn ? (
              <>
                <Button
                  variant="outline"
                  className="border-2 cursor-pointer border-blue-600 text-blue-600 font-semibold rounded-full px-6 py-2 
                       hover:bg-blue-600 hover:text-white shadow-sm transform hover:scale-105 
                       transition-all duration-300"
                  onClick={handleLogin}
                >
                  Sign In
                </Button>

                <Button
                  className="bg-gradient-to-r cursor-pointer from-yellow-300 to-yellow-400 text-gray-800 rounded-full 
                       px-6 py-2 font-semibold shadow-sm hover:from-yellow-400 hover:to-yellow-500 
                       transform hover:scale-105 transition-all duration-300"
                  onClick={handleGetStarted}
                >
                  Get Started
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="bg-blue-600 text-white rounded-full px-6 py-2 font-semibold shadow-sm hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
                  onClick={handleDashboard}
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 font-bold rounded-full px-6 py-2 
                     hover:bg-gray-900 cursor-pointer transform hover:scale-105 transition-all duration-300"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-4" variant="secondary">
            Real-time Supply Chain Intelligence
          </Badge>
          <h2 className="text-5xl font-bold text-foreground mb-6 leading-tight">
            Predict Risks, Track Shipments,
            <span className="text-accent"> Deliver Excellence</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Complete supply chain visibility with AI-powered risk prediction, real-time GPS tracking, and seamless
            collaboration between suppliers, drivers, and consumers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Everything You Need for Supply Chain Excellence</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From predictive analytics to real-time tracking, our platform provides comprehensive tools for modern
              supply chain management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Shield className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Risk Prediction</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  AI-powered analysis of weather, traffic, and route conditions to predict and prevent delays before
                  they happen.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Live GPS Tracking</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Real-time location updates from driver mobile devices with automatic status notifications and ETA
                  calculations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Analytics Dashboard</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Comprehensive insights into delivery performance, risk patterns, and operational efficiency metrics.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Multi-Role Access</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Tailored dashboards for suppliers, drivers, consumers, and administrators with role-based permissions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Real-time Alerts</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Instant notifications for delays, route changes, delivery confirmations, and risk warnings.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Mobile Optimized</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Fully responsive design ensures seamless experience across desktop, tablet, and mobile devices.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Built for Every Role in Your Supply Chain</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Specialized tools and interfaces designed for suppliers, drivers, consumers, and administrators.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Suppliers</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="mb-4">
                  Create shipments, assign drivers, track deliveries, and monitor supply chain performance.
                </CardDescription>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/supplier">Learn More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Drivers</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="mb-4">
                  Mobile-friendly interface for GPS tracking, status updates, and route optimization.
                </CardDescription>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/driver">Learn More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Consumers</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="mb-4">
                  Track your shipments in real-time and receive updates on delivery status and ETAs.
                </CardDescription>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/consumer">Learn More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Administrators</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="mb-4">
                  Comprehensive analytics, user management, and system oversight capabilities.
                </CardDescription>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/admin">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center max-w-3xl">
          <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Supply Chain?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses already using SupplyTrack Pro to optimize their logistics operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold text-foreground">SupplyTrack Pro</span>
              </div>
              <p className="text-muted-foreground">
                Advanced supply chain management with real-time tracking and predictive analytics.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Platform</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/supplier" className="hover:text-foreground transition-colors">
                    For Suppliers
                  </Link>
                </li>
                <li>
                  <Link href="/driver" className="hover:text-foreground transition-colors">
                    For Drivers
                  </Link>
                </li>
                <li>
                  <Link href="/consumer" className="hover:text-foreground transition-colors">
                    For Consumers
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-foreground transition-colors">
                    Admin Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Features</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Risk Prediction</li>
                <li>GPS Tracking</li>
                <li>Analytics</li>
                <li>Mobile App</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Contact Support</li>
                <li>System Status</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 SupplyTrack Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
