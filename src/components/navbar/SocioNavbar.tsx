"use client"

import * as React from "react"
import {
  Search,
  TrendingUp,
  BarChart3,
  Heart,
  User,
  Settings,
  Wallet,
  Grid3X3,
  Menu,
  X,
  LogOut,
  Loader2,
  Key,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ThemeSwitch } from "../theme-switch"
import { useAuthStore } from "@/store/auth"
import { useNavigate } from "react-router-dom"
import { useClub } from "@/hooks/useClub"
import { ModalCambiarPassword } from "@/components/forms/ModalCambiarPassword"

const navigationItems = [
  {
    title: "Inicio",
    icon: Grid3X3,
    href: "/dashboard",
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

export default function ClubNavbar() {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const { club, isLoading } = useClub()


  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileOpen && !(event.target as Element).closest("[data-sidebar]")) {
        setIsMobileOpen(false)
      }
    }

    if (isMobileOpen) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [isMobileOpen])


  React.useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileOpen])

  if (isLoading) {
    return <Loader2 />
  }

  if (!club) {
    return null
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-8 left-6 z-[50] lg:hidden bg-background/95 backdrop-blur-md border-border/50 shadow-lg"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        data-sidebar="mobile-trigger"
      >
        {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" /> }
      </Button>

      {/* Desktop Overlay - appears when sidebar is expanded */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-30 hidden lg:block transition-all duration-200 ease-out"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed top-0 inset-x-0 bottom-0 bg-black/70 backdrop-blur-md z-[45] lg:hidden transition-all duration-300 ease-out"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative z-[45] h-[calc(100vh-5rem)] top-20 lg:top-0 bg-card/95 backdrop-blur-md border-r border-border/50 
          transition-all duration-300 ease-out shadow-2xl lg:shadow-none
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isExpanded ? "w-80" : "w-16 lg:w-20"}
          ${isMobileOpen ? "w-[85vw] max-w-[320px]" : ""}
        `}
        onMouseEnter={() => !isMobileOpen && setIsExpanded(true)}
        onMouseLeave={() => !isMobileOpen && setIsExpanded(false)}
        data-sidebar="main"
      >
        {/* Header */}
        <div className="flex items-center justify-center h-16 border-b border-border/50 bg-background/50">
          <div className={`transition-all duration-200 ease-out ${isExpanded ? "scale-100" : "scale-75"}`}>
            {isExpanded ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  {club.image ? (
                    <img
                      src={club.image || "/placeholder.svg"}
                      alt={club.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <span className="text-white font-bold text-lg">{club.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-foreground">{club.name}</span>
                  <span className="text-xs text-muted-foreground">Cannabis Club</span>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                {club.image ? (
                  <img
                    src={club.image || "/placeholder.svg"}
                    alt={club.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <span className="text-white font-bold text-lg">{club.name.charAt(0)}</span>
                )}
              </div>
            )}
          </div>
        </div>



        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-2">
          <div className="p-2 space-y-1">
            {/* Main Navigation */}
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <Button
                  key={item.title}
                  variant="ghost"
                  className={`
                    w-full h-11 transition-all duration-200 ease-out
                    ${isExpanded || isMobileOpen ? "justify-start px-3" : "justify-center px-0"}
                    hover:bg-accent/80 hover:text-accent-foreground hover:scale-[1.02]
                    group relative overflow-hidden rounded-xl
                    text-base bg-transparent
                    dark:hover:bg-slate-800/50 
                  `}
                  onClick={() => {
                    navigate(item.href)
                    setIsMobileOpen(false)
                  }}
                >
                  <item.icon className={`h-5 w-5 min-w-[20px] transition-all duration-200 ease-out ${isExpanded || isMobileOpen ? "mr-3" : ""}`} />
                  <span
                    className={`
                    flex-1 text-left transition-all duration-200 ease-out whitespace-nowrap
                    ${isExpanded || isMobileOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 lg:hidden"}
                  `}
                  >
                    {item.title}
                  </span>
                  {item.badge && (isExpanded || isMobileOpen) && (
                    <Badge
                      variant="secondary"
                      className="ml-auto text-xs transition-all duration-200 ease-out bg-primary/10 text-primary border-primary/20 px-2 py-0.5"
                    >
                      {item.badge}
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out rounded-xl" />
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border/50 bg-background/30 p-3">
          <div className="space-y-1">
            <Button
              variant="ghost"
              onClick={() => {
                navigate(`/config/${club.id}`)
                setIsMobileOpen(false)
              }}
              className={`
                w-full h-11 transition-all duration-200 ease-out rounded-xl
                ${isExpanded || isMobileOpen ? "justify-start px-3" : "justify-center px-0"}
                hover:bg-accent/80 hover:text-accent-foreground hover:scale-[1.02]
                bg-transparent
                dark:hover:bg-slate-800/50
              `}
            >
        
              <Settings className={`h-5 w-5 transition-all duration-200 ease-out ${isExpanded || isMobileOpen ? "mr-3" : ""}`} />
              <span
                className={`
                transition-all duration-200 ease-out
                ${isExpanded || isMobileOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 lg:hidden"}
              `}
              >
                Configuración
              </span>
            </Button>

            <ModalCambiarPassword
              trigger={
                <Button
                  variant="ghost"
                  className={`w-full h-11 transition-all duration-200 ease-out rounded-xl ${isExpanded || isMobileOpen ? "justify-start px-3" : "justify-center px-0"} hover:bg-yellow-100/80 hover:text-yellow-700 hover:scale-[1.02] bg-transparent dark:hover:bg-yellow-900/30`}
                >
                  <Key className={`h-5 w-5 transition-all duration-200 ease-out ${isExpanded || isMobileOpen ? "mr-3" : ""}`} />
                  <span className={`${isExpanded || isMobileOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 lg:hidden"} transition-all duration-200 ease-out`}>
                    Cambiar contraseña
                  </span>
                </Button>
              }
            />

            <Button
              variant="ghost"
              className={`
                w-full h-11 transition-all duration-200 ease-out rounded-xl
                ${isExpanded || isMobileOpen ? "justify-start px-3" : "justify-center px-0"}
                hover:bg-destructive/10 hover:text-destructive hover:scale-[1.02]
              `}
              onClick={() => {
                logout()
                navigate("/")
                setIsMobileOpen(false)
              }}
            >
              <LogOut className={`h-5 w-5 transition-all duration-200 ease-out ${isExpanded || isMobileOpen ? "mr-3" : ""}`} />
              <span
                className={`
                transition-all duration-200 ease-out
                ${isExpanded || isMobileOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 lg:hidden"}
              `}
              >
                Cerrar sesión
              </span>
            </Button>
          </div>
        </div>
      </div>

      <div
        className={`
        hidden lg:block transition-all duration-200 ease-out
        ${isExpanded ? "w-0" : "w-20"}
      `}
      />
    </>
  )
}
