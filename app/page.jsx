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
import { motion } from "framer-motion";
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

  const handleGetStarted = () => router.push("/signup");
  const handleLogin = () => router.push("/login");

  const handleDashboard = () => {
    if (category === "consumer") router.push("/consumer/dashboard");
    else if (category === "supplier") router.push("/supplier/dashboard");
    else if (category === "driver") router.push("/drivers/dashboard");
    else router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href={"/"}>
            <div className="flex items-center gap-3 cursor-pointer">
              <Truck className="h-10 w-10 text-blue-600 animate-bounce" />
              <h1 className="text-3xl font-extrabold tracking-tight">
                IntelRoute
              </h1>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            {!loggedIn ? (
              <>
                <Button
                  variant="outline"
                  className="border-2 border-blue-600 text-blue-600 font-semibold rounded-full px-6 py-2 hover:bg-blue-600 hover:text-white transform hover:scale-105 transition-all duration-300"
                  onClick={handleLogin}
                >
                  Sign In
                </Button>
                <Button
                  className="bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold rounded-full px-6 py-2 shadow-sm hover:from-blue-500 hover:to-blue-600 transform hover:scale-105 transition-all duration-300"
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
                  className="border-gray-300 text-gray-700 rounded-full px-6 py-2 hover:bg-gray-200 transform hover:scale-105 transition-all duration-300"
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
      <section
        className="relative py-32 px-6 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.9)), url('/images/minimal-world-map.svg')",
        }}
      >
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 bg-blue-100 text-blue-600 border border-blue-300">
              Real-time Supply Chain Intelligence
            </Badge>
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Predict Risks, Track Shipments,
              <span className="text-blue-600"> Deliver Excellence</span>
            </h2>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Complete supply chain visibility with AI-powered risk prediction, real-time GPS tracking, and seamless collaboration between suppliers, drivers, and consumers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 bg-blue-600 text-white hover:bg-blue-700">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 border-blue-600 text-blue-600 hover:bg-blue-100">
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-100">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 text-blue-600">
              Everything You Need for Supply Chain Excellence
            </h3>
            <p className="text-gray-700 max-w-2xl mx-auto">
              From predictive analytics to real-time tracking, our platform provides comprehensive tools for modern supply chain management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Risk Prediction", desc: "AI-powered analysis of weather, traffic, and route conditions to predict and prevent delays before they happen." },
              { icon: MapPin, title: "Live GPS Tracking", desc: "Real-time location updates from driver mobile devices with automatic status notifications and ETA calculations." },
              { icon: BarChart3, title: "Analytics Dashboard", desc: "Comprehensive insights into delivery performance, risk patterns, and operational efficiency metrics." },
              { icon: Users, title: "Multi-Role Access", desc: "Tailored dashboards for suppliers, drivers, consumers, and administrators with role-based permissions." },
              { icon: Clock, title: "Real-time Alerts", desc: "Instant notifications for delays, route changes, delivery confirmations, and risk warnings." },
              { icon: CheckCircle, title: "Mobile Optimized", desc: "Fully responsive design ensures seamless experience across desktop, tablet, and mobile devices." },
            ].map((item, i) => (
              <motion.div key={i} whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <Card className="bg-white shadow-md border border-gray-200 hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <item.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle>{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-700">
                      {item.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-blue-600 mb-4">Built for Every Role in Your Supply Chain</h3>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Specialized tools and interfaces designed for suppliers, drivers, consumers, and administrators.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {["Suppliers", "Drivers", "Consumers", "Administrators"].map((role, idx) => (
              <Card key={idx} className="border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div className="mx-auto p-3 bg-blue-100 rounded-full w-fit mb-4">
                    {role === "Suppliers" && <Truck className="h-8 w-8 text-blue-600" />}
                    {role === "Drivers" && <MapPin className="h-8 w-8 text-blue-600" />}
                    {role === "Consumers" && <Users className="h-8 w-8 text-blue-600" />}
                    {role === "Administrators" && <BarChart3 className="h-8 w-8 text-blue-600" />}
                  </div>
                  <CardTitle>{role}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="mb-4">
                    {role === "Suppliers" && "Create shipments, assign drivers, track deliveries, and monitor performance."}
                    {role === "Drivers" && "Mobile-friendly interface for GPS tracking, status updates, and route optimization."}
                    {role === "Consumers" && "Track your shipments in real-time and receive updates on delivery status."}
                    {role === "Administrators" && "Comprehensive analytics, user management, and system oversight capabilities."}
                  </CardDescription>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href={`/${role.toLowerCase()}`}>Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12 px-4">
        <div className="container mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Truck className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">SupplyTrack Pro</span>
            </div>
            <p className="text-gray-600">Advanced supply chain management with real-time tracking and predictive analytics.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-600">
              <li><Link href="/supplier" className="hover:text-blue-600">For Suppliers</Link></li>
              <li><Link href="/driver" className="hover:text-blue-600">For Drivers</Link></li>
              <li><Link href="/consumer" className="hover:text-blue-600">For Consumers</Link></li>
              <li><Link href="/admin" className="hover:text-blue-600">Admin Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Features</h4>
            <ul className="space-y-2 text-gray-600">
              <li>Risk Prediction</li>
              <li>GPS Tracking</li>
              <li>Analytics</li>
              <li>Mobile App</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2 text-gray-600">
              <li>Documentation</li>
              <li>API Reference</li>
              <li>Contact Support</li>
              <li>System Status</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
          &copy; 2025 SupplyTrack Pro. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
