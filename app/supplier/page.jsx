import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Truck,
  MapPin,
  BarChart3,
  Users,
  CheckCircle,
  Package,
  AlertTriangle,
  TrendingUp,
  FileText,
  Settings,
} from "lucide-react"
import Link from "next/link"

export default function SupplierPage() {
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
              <Link href="/driver" className="text-muted-foreground hover:text-foreground transition-colors">
                For Drivers
              </Link>
              <Link href="/consumer" className="text-muted-foreground hover:text-foreground transition-colors">
                For Consumers
              </Link>
              <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                Admin
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Button variant="outline">Sign In</Button>
              <Button>Start Free Trial</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-4" variant="secondary">
            For Supply Chain Managers & Suppliers
          </Badge>
          <h2 className="text-5xl font-bold text-foreground mb-6 leading-tight">
            Streamline Your Supply Chain
            <span className="text-accent"> Operations</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Create shipments, assign drivers, predict risks, and monitor deliveries in real-time. Take control of your
            entire supply chain with intelligent automation and insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              Start Managing Shipments
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Key Benefits for Suppliers */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Everything Suppliers Need in One Platform</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From shipment creation to delivery confirmation, manage your entire supply chain workflow efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Package className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Shipment Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Create, track, and manage shipments with detailed origin/destination mapping, goods tracking, and
                  automated status updates.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Driver Assignment</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Assign drivers to shipments, monitor their performance, and reassign when needed with intelligent
                  matching algorithms.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Risk Prediction</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  AI-powered risk assessment for weather, traffic, and route conditions with proactive alerts and
                  alternative solutions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Real-time Tracking</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Live GPS tracking of all shipments with automatic milestone updates and ETA calculations for accurate
                  planning.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Performance Analytics</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Comprehensive dashboards showing delivery performance, delay patterns, driver efficiency, and cost
                  optimization insights.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Delivery Confirmation</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Automated delivery confirmations with photo proof, digital signatures, and instant notifications to
                  all stakeholders.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Streamlined Supplier Workflow</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From shipment creation to delivery confirmation, our platform guides you through every step.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border text-center">
              <CardHeader>
                <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">1. Create Shipment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Enter origin, destination, goods details, and expected delivery timeline with our intuitive form.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border text-center">
              <CardHeader>
                <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">2. Assign Driver</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Select from available drivers or let our system recommend the best match based on location and
                  performance.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border text-center">
              <CardHeader>
                <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">3. Monitor Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Track shipment in real-time, receive risk alerts, and communicate with drivers throughout the journey.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border text-center">
              <CardHeader>
                <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">4. Confirm Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Receive automatic delivery confirmation with proof of delivery and customer satisfaction feedback.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Powerful Supplier Dashboard</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get a complete overview of your supply chain operations with our comprehensive dashboard.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-accent" />
                  <CardTitle>Performance Metrics</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    On-time delivery rates and trends
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Average delivery times by route
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Driver performance rankings
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Cost per shipment analysis
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Settings className="h-6 w-6 text-accent" />
                  <CardTitle>Management Tools</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Bulk shipment creation and import
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Driver pool management
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Automated notifications and alerts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Custom reporting and exports
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center max-w-3xl">
          <h3 className="text-3xl font-bold mb-4">Ready to Optimize Your Supply Chain?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join leading suppliers who trust SupplyTrack Pro to manage their logistics operations efficiently.
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
              Request Demo
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
                <li>Shipment Management</li>
                <li>Driver Assignment</li>
                <li>Risk Prediction</li>
                <li>Performance Analytics</li>
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
