import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Truck,
  MapPin,
  Bell,
  Clock,
  CheckCircle,
  Search,
  Shield,
  Smartphone,
  Eye,
  Calendar,
  MessageCircle,
  Package,
} from "lucide-react"
import Link from "next/link"

export default function ConsumerPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">SupplyTrack Pro</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/supplier" className="text-muted-foreground hover:text-foreground transition-colors">
                For Suppliers
              </Link>
              <Link href="/driver" className="text-muted-foreground hover:text-foreground transition-colors">
                For Drivers
              </Link>
              <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                Admin
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Button variant="outline">Track Package</Button>
              <Button>Sign Up</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Tracking */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-4" variant="secondary">
            Real-Time Package Tracking
          </Badge>
          <h2 className="text-5xl font-bold text-foreground mb-6 leading-tight">
            Track Your Package
            <span className="text-accent"> Every Step of the Way</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Get real-time updates, accurate delivery estimates, and complete visibility into your shipment's journey
            from pickup to your doorstep.
          </p>

          {/* Quick Tracking Form */}
          <Card className="max-w-md mx-auto mb-8 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-center">
                <Search className="h-5 w-5" />
                Track Your Shipment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input placeholder="Enter tracking number" className="flex-1" />
                <Button>Track</Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Enter your tracking number to get real-time updates</p>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              Create Account
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Tracking Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Complete Shipment Visibility</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay informed with detailed tracking information and proactive notifications throughout your delivery.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Live Location Tracking</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  See exactly where your package is in real-time with GPS tracking and interactive maps showing the
                  current location.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Bell className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Instant Notifications</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Receive automatic updates via SMS, email, or push notifications for every milestone in your delivery
                  journey.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Accurate ETAs</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Get precise delivery time estimates that update automatically based on traffic, weather, and route
                  conditions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Shield className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Proactive Alerts</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Be the first to know about potential delays due to weather, traffic, or other factors affecting your
                  delivery.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Eye className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Delivery Transparency</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  View detailed delivery history, driver information, and photo proof of delivery for complete peace of
                  mind.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Smartphone className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Mobile Friendly</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Track your packages on any device with our responsive design that works perfectly on mobile, tablet,
                  and desktop.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tracking Journey */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Your Package Journey</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Follow your shipment through every stage of delivery with detailed status updates.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border text-center">
              <CardHeader>
                <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">Package Picked Up</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your package has been collected from the sender and is ready to begin its journey to you.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border text-center">
              <CardHeader>
                <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">In Transit</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your package is on the move! Track its real-time location and estimated arrival time.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border text-center">
              <CardHeader>
                <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">Out for Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your package is on the delivery vehicle and will arrive at your location within the estimated
                  timeframe.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border text-center">
              <CardHeader>
                <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">Delivered</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Package successfully delivered! View delivery confirmation, photos, and provide feedback.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits for Consumers */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Why Customers Love Our Tracking</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the peace of mind that comes with complete shipment visibility and proactive communication.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-accent" />
                  <CardTitle>Plan Your Day</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Accurate delivery time windows
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Real-time ETA updates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Advance notice of delays
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Flexible delivery options
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-6 w-6 text-accent" />
                  <CardTitle>Stay Connected</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Direct communication with drivers
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Multiple notification channels
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    24/7 customer support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Delivery feedback system
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sample Tracking Interface */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Simple, Intuitive Tracking</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our clean, easy-to-use interface makes tracking your packages effortless.
            </p>
          </div>

          <Card className="max-w-2xl mx-auto border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Tracking #: ST123456789
              </CardTitle>
              <CardDescription>Estimated delivery: Today, 2:30 PM - 4:30 PM</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-medium">Out for Delivery</p>
                    <p className="text-sm text-muted-foreground">Your package is on the delivery vehicle</p>
                  </div>
                  <span className="text-sm text-muted-foreground ml-auto">1:45 PM</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Departed Facility</p>
                    <p className="text-sm text-muted-foreground">Package left the distribution center</p>
                  </div>
                  <span className="text-sm text-muted-foreground ml-auto">11:20 AM</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Package Picked Up</p>
                    <p className="text-sm text-muted-foreground">Collected from sender</p>
                  </div>
                  <span className="text-sm text-muted-foreground ml-auto">Yesterday, 3:15 PM</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-border">
                <Button className="w-full">View on Map</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center max-w-3xl">
          <h3 className="text-3xl font-bold mb-4">Never Wonder About Your Package Again</h3>
          <p className="text-xl mb-8 opacity-90">
            Join millions of customers who trust SupplyTrack Pro for reliable, transparent package tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Track a Package
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              Create Account
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
              <h4 className="font-semibold text-foreground mb-4">Tracking</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Track Package</li>
                <li>Delivery Updates</li>
                <li>Mobile Tracking</li>
                <li>Notifications</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Customer Support</li>
                <li>Tracking Help</li>
                <li>Delivery Issues</li>
                <li>Contact Us</li>
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
