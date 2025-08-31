import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Truck,
  MapPin,
  Smartphone,
  Navigation,
  CheckCircle,
  AlertTriangle,
  Clock,
  MessageSquare,
  Route,
  Shield,
  Zap,
  Star,
} from "lucide-react"
import Link from "next/link"

export default function DriverPage() {
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
              <Link href="/consumer" className="text-muted-foreground hover:text-foreground transition-colors">
                For Consumers
              </Link>
              <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                Admin
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Button variant="outline">Driver Login</Button>
              <Button>Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-4" variant="secondary">
            Mobile-First Driver Platform
          </Badge>
          <h2 className="text-5xl font-bold text-foreground mb-6 leading-tight">
            Drive Smart with
            <span className="text-accent"> Real-Time Intelligence</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            GPS tracking, route optimization, instant updates, and risk alerts - all in a mobile-friendly interface
            designed for drivers on the go.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              Start Driving Today
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
              Download Mobile App
            </Button>
          </div>
        </div>
      </section>

      {/* Mobile-First Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Built for Drivers, Optimized for Mobile</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage deliveries efficiently, right from your smartphone or tablet.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Auto GPS Tracking</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Automatic location updates with no manual input required. Your position is shared securely with
                  suppliers and customers.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Zap className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>One-Tap Updates</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Quick status updates with large, touch-friendly buttons: Picked Up, Departed, Arrived, Delivered.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Navigation className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Smart Navigation</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Optimized routes with real-time traffic updates and alternative path suggestions to avoid delays.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Risk Alerts</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Instant notifications about weather conditions, traffic jams, and high-risk zones along your route.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Direct Communication</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Chat with suppliers and customers directly through the app for updates, delays, or special
                  instructions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Smartphone className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Offline Capable</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Works even with poor connectivity. Data syncs automatically when connection is restored.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Driver Workflow */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Simple Driver Workflow</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Streamlined process designed for efficiency and ease of use while driving.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border text-center">
              <CardHeader>
                <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">1. Accept Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Receive shipment assignment with pickup location, destination, and delivery details.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border text-center">
              <CardHeader>
                <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <Route className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">2. Navigate & Track</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Follow optimized route with automatic GPS tracking and real-time location sharing.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border text-center">
              <CardHeader>
                <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">3. Update Status</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Tap to update: Picked Up, Departed, Reached Checkpoint, or Delivered with one touch.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border text-center">
              <CardHeader>
                <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">4. Complete Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Confirm delivery with photo proof, digital signature, and automatic notification to all parties.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mobile Interface Preview */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Designed for Mobile Excellence</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Large buttons, clear text, and intuitive navigation make it easy to use while on the road.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-accent" />
                  <CardTitle>Safety First</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Voice commands for hands-free operation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Large touch targets for easy tapping
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    High contrast mode for better visibility
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Emergency contact and support features
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Smartphone className="h-6 w-6 text-accent" />
                  <CardTitle>Smart Features</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Battery optimization for all-day use
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Dark mode for night driving
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Automatic photo capture for proof of delivery
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Integration with popular navigation apps
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits for Drivers */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Why Drivers Choose SupplyTrack Pro</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built by drivers, for drivers. We understand the challenges of the road.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-border text-center">
              <CardHeader>
                <div className="mx-auto p-3 bg-accent/10 rounded-full w-fit mb-4">
                  <Clock className="h-8 w-8 text-accent" />
                </div>
                <CardTitle>Save Time</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Automated tracking and one-tap updates eliminate paperwork and reduce administrative tasks.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border text-center">
              <CardHeader>
                <div className="mx-auto p-3 bg-accent/10 rounded-full w-fit mb-4">
                  <Route className="h-8 w-8 text-accent" />
                </div>
                <CardTitle>Optimize Routes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Smart routing saves fuel costs and reduces delivery times with real-time traffic optimization.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border text-center">
              <CardHeader>
                <div className="mx-auto p-3 bg-accent/10 rounded-full w-fit mb-4">
                  <Star className="h-8 w-8 text-accent" />
                </div>
                <CardTitle>Improve Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Better communication and on-time deliveries lead to higher customer satisfaction and driver ratings.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center max-w-3xl">
          <h3 className="text-3xl font-bold mb-4">Ready to Drive Smarter?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of drivers already using SupplyTrack Pro to streamline their delivery operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Driving Today
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              Download Mobile App
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
              <h4 className="font-semibold text-foreground mb-4">Driver Features</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>GPS Tracking</li>
                <li>Route Optimization</li>
                <li>Mobile Interface</li>
                <li>Risk Alerts</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Driver Support</li>
                <li>Mobile App Guide</li>
                <li>Emergency Contact</li>
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
