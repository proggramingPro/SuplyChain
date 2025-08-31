"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Truck, Package, Users, BarChart3, Home, Menu, X } from "lucide-react"
import { useState } from "react"

const navigationItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/supplier", label: "Suppliers", icon: Package },
  { href: "/driver", label: "Drivers", icon: Truck },
  { href: "/consumer", label: "Consumers", icon: Users },
  { href: "/admin", label: "Admin", icon: BarChart3 },
]

const dashboardItems = [
  { href: "/supplier/dashboard", label: "Supplier Dashboard", role: "supplier" },
  { href: "/driver/dashboard", label: "Driver Dashboard", role: "driver" },
  { href: "/consumer/dashboard", label: "Consumer Dashboard", role: "consumer" },
  { href: "/admin/dashboard", label: "Admin Dashboard", role: "admin" },
]

export function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Truck className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-xl">SupplyTrack Pro</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Dashboard Quick Access */}
        <div className="hidden md:flex items-center space-x-2">
          {dashboardItems.map((item) => {
            if (pathname.startsWith(`/${item.role}`)) {
              return (
                <Button key={item.href} asChild variant="outline" size="sm">
                  <Link href={item.href}>Dashboard</Link>
                </Button>
              )
            }
            return null
          })}
          <Button asChild size="sm">
            <Link href="/supplier/dashboard">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-primary hover:bg-muted"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
            <div className="pt-2 space-y-2">
              {dashboardItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
