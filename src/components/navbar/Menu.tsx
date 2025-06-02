"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { ExternalLink, Settings, LogOut, Home, Compass, Heart, User, BarChart3, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ThemeSwitch } from "../theme-switch"
import { useNavigate } from "react-router-dom"

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    // Aquí iría la lógica de logout
    navigate("/")
    setIsOpen(false)
  }

  const navigationItems = [
    {
      title: "Inicio",
      description: "Página principal",
      href: "/",
      icon: Home
    },
    {
      title: "Explorar",
      description: "Descubre nuevos clubs",
      href: "/explore",
      icon: Compass
    },
    {
      title: "Mis Clubs",
      description: "Tus clubs favoritos",
      href: "/my-clubs",
      icon: Heart
    },
    {
      title: "Perfil",
      description: "Tu perfil personal",
      href: "/profile",
      icon: User
    }
  ]

  const quickActions = [
    {
      title: "Explorar",
      icon: Compass,
      href: "/explore",
      badge: "Nuevo"
    },
    {
      title: "Estadísticas",
      icon: BarChart3,
      href: "/stats"
    },
    {
      title: "Tendencias",
      icon: TrendingUp,
      href: "/trending",
      badge: "🔥"
    },
    {
      title: "Favoritos",
      icon: Heart,
      href: "/favorites"
    }
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true)
      setIsAnimating(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => setIsOpen(false), 300)
  }

  const handleOpen = () => {
    setIsOpen(true)
    setIsAnimating(true)
  }

  if (!isOpen) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Button onClick={handleOpen} className="bg-amber-100 text-black hover:bg-amber-200">
          Open BAYC Menu
        </Button>
      </div>
    )
  }

  return (
    <>
    <div>
      {/* Hamburger Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm border-2 hover:bg-accent transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="relative w-5 h-5">
          <span
            className={`absolute block h-0.5 w-5 bg-current transform transition-all duration-300 ease-in-out ${
              isOpen ? 'rotate-45 translate-y-2' : 'translate-y-0'
            }`}
          />
          <span
            className={`absolute block h-0.5 w-5 bg-current transform transition-all duration-300 ease-in-out translate-y-2 ${
              isOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`absolute block h-0.5 w-5 bg-current transform transition-all duration-300 ease-in-out ${
              isOpen ? '-rotate-45 translate-y-2' : 'translate-y-4'
            }`}
          />
        </div>
      </Button>
</div>
      {/* Menu Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-80 z-40 transform transition-all duration-500 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Paper-like background with shadow */}
        <div className="h-full bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 shadow-2xl border-r-4 border-amber-200 dark:border-amber-800 relative overflow-hidden">
          {/* Paper texture overlay */}
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSI3IiBjeT0iNyIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')]" />
          
          {/* Content */}
          <div className="relative h-full flex flex-col p-6">
            {/* Header with Club Logo */}
            <div className="text-center mb-8 pt-12">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-white dark:bg-gray-800 rounded-full shadow-lg border-4 border-amber-200 dark:border-amber-700">
                <img 
                  src="/placeholder.svg" 
                  alt="Club Logo" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100 tracking-wide">
                  Club Name
                </h2>
                <p className="text-sm text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                  FOR THE COMMUNITY
                </p>
              </div>
            </div>

            {/* Go to Club Button */}
            <Button 
              className="w-full mb-8 bg-amber-800 hover:bg-amber-900 text-white border-2 border-amber-900 shadow-lg font-bold tracking-wide"
              onClick={() => {
                navigate('/club')
                setIsOpen(false)
              }}
            >
              GO TO THE CLUB
            </Button>

            {/* Main Navigation */}
            <div className="space-y-4 mb-8">
              {navigationItems.map((item) => (
                <div key={item.title} className="group">
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-auto p-4 text-left hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-all duration-200"
                    onClick={() => {
                      navigate(item.href)
                      setIsOpen(false)
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="h-5 w-5 text-amber-700 dark:text-amber-300" />
                      <div>
                        <div className="font-bold text-amber-900 dark:text-amber-100 text-lg">
                          {item.title}
                        </div>
                        <div className="text-xs text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                </div>
              ))}
            </div>

            {/* Members Only Section */}
            <div className="mb-6">
              <p className="text-xs text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-4 font-bold">
                MEMBERS ONLY
              </p>
              <Separator className="bg-amber-300 dark:bg-amber-700 mb-4" />
              
              <Button 
                className="w-full bg-white dark:bg-gray-800 text-amber-900 dark:text-amber-100 border-2 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 shadow-md font-bold"
                onClick={() => {
                  navigate('/join')
                  setIsOpen(false)
                }}
              >
                🔑 Join the club
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="mt-auto">
              <p className="text-xs text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-3 font-bold">
                Quick Actions
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {quickActions.slice(0, 4).map((item) => (
                  <Button
                    key={item.title}
                    variant="outline"
                    size="sm"
                    className="h-auto p-2 flex flex-col items-center space-y-1 bg-white/50 dark:bg-gray-800/50 border-amber-200 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                    onClick={() => {
                      navigate(item.href)
                      setIsOpen(false)
                    }}
                  >
                    <item.icon className="h-4 w-4 text-amber-700 dark:text-amber-300" />
                    <span className="text-xs text-amber-800 dark:text-amber-200 font-medium">
                      {item.title}
                    </span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-amber-300 dark:border-amber-700">
                <ThemeSwitch />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                  onClick={() => {
                    navigate('/settings')
                    setIsOpen(false)
                  }}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => {
                    handleLogout()
                  }}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
