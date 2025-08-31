import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Truck,
  BarChart3,
  Users,
  Settings,
  TrendingUp,
  Shield,
  AlertTriangle,
  PieChart,
  Activity,
  Database,
  Globe,
  CheckCircle,
  Clock,
  Target,
  Zap,
  Eye,
} from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
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
              <Link href="/consumer" className="text-muted-foreground hover:text-foreground transition-colors">
                For Consumers
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Button variant="outline">Admin Login</Button>
              <Button>Request Demo</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-4" variant="secondary">
            Enterprise Supply Chain Management
          </Badge>
          <h2 className="text-5xl font-bold text-foreground mb-6 leading-tight">
            Complete Supply Chain
            <span className="text-accent"> Command Center</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Comprehensive analytics, user management, and operational oversight. Monitor performance, identify trends,
            and optimize your entire supply chain ecosystem from a single dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              Schedule Admin Demo
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
              View Features
            </Button>
          </div>
        </div>
      </section>

      {/* Core Admin Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Comprehensive Administrative Control</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage, monitor, and optimize your supply chain operations at scale.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Advanced Analytics</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Comprehensive dashboards with real-time KPIs, performance metrics, and predictive analytics for
                  data-driven decisions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>User Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Manage suppliers, drivers, and consumers with role-based permissions, performance tracking, and
                  automated workflows.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Activity className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>System Monitoring</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Real-time system health monitoring, performance alerts, and automated issue detection across all
                  platform components.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Performance Optimization</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Identify bottlenecks, optimize routes, and improve delivery times with AI-powered recommendations and
                  insights.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Shield className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Risk Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Proactive risk assessment, alert management, and contingency planning to minimize disruptions and
                  delays.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Settings className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>System Configuration</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Customize workflows, set business rules, configure integrations, and manage system-wide settings and
                  preferences.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Analytics Dashboard Preview */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Powerful Analytics Dashboard</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get instant insights into your supply chain performance with comprehensive metrics and visualizations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-border text-center">
              <CardHeader className="pb-3">
                <div className="mx-auto p-2 bg-accent/10 rounded-lg w-fit mb-2">
                  <Target className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-2xl">94.2%</CardTitle>
                <CardDescription>On-Time Delivery Rate</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border text-center">
              <CardHeader className="pb-3">
                <div className="mx-auto p-2 bg-accent/10 rounded-lg w-fit mb-2">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-2xl">2.3 hrs</CardTitle>
                <CardDescription>Average Delivery Time</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border text-center">
              <CardHeader className="pb-3">
                <div className="mx-auto p-2 bg-accent/10 rounded-lg w-fit mb-2">
                  <Truck className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-2xl">1,247</CardTitle>
                <CardDescription>Active Shipments</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border text-center">
              <CardHeader className="pb-3">
                <div className="mx-auto p-2 bg-accent/10 rounded-lg w-fit mb-2">
                  <AlertTriangle className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-2xl">12</CardTitle>
                <CardDescription>Risk Alerts Today</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <PieChart className="h-6 w-6 text-accent" />
                  <CardTitle>Operational Insights</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Route efficiency analysis and optimization
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Driver performance rankings and metrics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Cost per shipment breakdown and trends
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Customer satisfaction scores and feedback
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Database className="h-6 w-6 text-accent" />
                  <CardTitle>Data Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Custom report generation and scheduling
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Data export and integration capabilities
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Historical trend analysis and forecasting
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Automated compliance reporting
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Management Capabilities */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Complete Ecosystem Management</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Manage every aspect of your supply chain operations from user roles to system configurations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-border text-center">
              <CardHeader>
                <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Multi-Role Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Manage suppliers, drivers, consumers, and admin users with granular permissions and access controls.
                </CardDescription>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Role-based access control</li>
                  <li>• User onboarding workflows</li>
                  <li>• Performance tracking</li>
                  <li>• Automated user management</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border text-center">
              <CardHeader>
                <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>System Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Connect with existing ERP, WMS, and third-party logistics systems for seamless data flow.
                </CardDescription>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• API management and monitoring</li>
                  <li>• Data synchronization</li>
                  <li>• Custom integrations</li>
                  <li>• Webhook configurations</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border text-center">
              <CardHeader>
                <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Automation & Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Create automated workflows for common tasks, notifications, and business process optimization.
                </CardDescription>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Automated alert systems</li>
                  <li>• Custom workflow builder</li>
                  <li>• Business rule engine</li>
                  <li>• Process optimization</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Enterprise-Grade Capabilities</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for scale with enterprise security, compliance, and performance requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-accent" />
                  <CardTitle>Security & Compliance</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    SOC 2 Type II compliance
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    End-to-end data encryption
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Multi-factor authentication
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Audit logs and compliance reporting
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Eye className="h-6 w-6 text-accent" />
                  <CardTitle>Monitoring & Support</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    24/7 system monitoring and alerts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Dedicated customer success manager
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Priority technical support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Custom training and onboarding
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
          <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Supply Chain Operations?</h3>
          <p className="text-xl mb-8 opacity-90">
            Get complete visibility and control over your supply chain with our enterprise-grade admin platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Schedule Enterprise Demo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              Contact Sales Team
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
              <h4 className="font-semibold text-foreground mb-4">Admin Features</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Analytics Dashboard</li>
                <li>User Management</li>
                <li>System Monitoring</li>
                <li>Risk Management</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Enterprise</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Enterprise Sales</li>
                <li>Custom Solutions</li>
                <li>API Documentation</li>
                <li>Security & Compliance</li>
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
