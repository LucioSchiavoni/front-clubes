"use client"

import * as React from "react"
import { Search, TrendingUp, BarChart3, Heart, User, Settings, Wallet, Grid3X3, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ThemeSwitch } from "../theme-switch"
import { useAuthStore } from "@/store/auth"
import { useNavigate } from "react-router-dom"

const navigationItems = [
  {
    title: "Explorar",
    icon: Grid3X3,
    href: "/explore",
    badge: "Nuevo",
  },
  {
    title: "Estadísticas",
    icon: BarChart3,
    href: "/stats",
  },
  {
    title: "Tendencias",
    icon: TrendingUp,
    href: "/trending",
    badge: "🔥",
  },
  {
    title: "Favoritos",
    icon: Heart,
    href: "/favorites",
  },
  {
    title: "Mi Perfil",
    icon: User,
    href: "/profile",
  },
  {
    title: "Billetera",
    icon: Wallet,
    href: "/wallet",
  },
]

export default function AdminNavbar() {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)
      const logout = useAuthStore((state) => state.logout);
      const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative z-50 h-full bg-card border-r border-border transition-all duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isExpanded ? "w-80" : "w-16 lg:w-20"}
        `}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-border">
          <div className={`transition-all duration-300 ${isExpanded ? "scale-100" : "scale-75"}`}>
            {isExpanded ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CC</span>
                </div>
                <span className="font-bold text-lg">Administrador</span>
              </div>
            ) : (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        {isExpanded && (
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Buscar..." className="pl-10" />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {/* Main Navigation */}
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <Button
                  key={item.title}
                  variant="ghost"
                  className={`
                    w-full justify-start h-12 transition-all duration-200
                    ${isExpanded ? "px-4" : "px-0 justify-center"}
                    hover:bg-accent hover:text-accent-foreground
                    group relative overflow-hidden
                  `}
                >
                  <item.icon className={`h-5 w-5 ${isExpanded ? "mr-3" : ""} transition-all duration-200`} />
                  {isExpanded && (
                    <>
                      <span className="flex-1 text-left">{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </Button>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="absolute bottom-4 left-2 right-2">
              <Separator className="mb-4" />
              <div className="space-y-1 flex flex-col justify-center items-center">
                <ThemeSwitch />
                <Button
                  variant="ghost"
                  className={`
                    w-full justify-start h-12
                    ${isExpanded ? "px-4" : "px-0 justify-center"}
                    hover:bg-accent hover:text-accent-foreground
                  `}
                >
                  <Settings className={`h-5 w-5 ${isExpanded ? "mr-3" : ""}`} />
                  {isExpanded && <span>Configuración</span>}
                </Button>
              </div>
            </div>
          </div>
            {/* Botón de cerrar sesión */}
          <Button
            variant="ghost"
            className={`
              w-full justify-start h-12
              ${isExpanded ? "px-4" : "px-0 justify-center"}
              hover:bg-destructive hover:text-destructive-foreground
            `}
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            <X className={`h-5 w-5 ${isExpanded ? "mr-3" : ""}`} />
            {isExpanded && <span>Cerrar sesión</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}
