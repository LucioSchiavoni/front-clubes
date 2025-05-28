import * as React from "react"
import { Search, TrendingUp, BarChart3, Heart, User, Settings, Wallet, Grid3X3, Menu, X, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

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
  const [isExpanded, setIsExpanded] = React.useState(true)
  const [isMobile, setIsMobile] = React.useState(false)
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const { profile } = useAuthStore();

  // Detectar si es móvil
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsExpanded(false);
    }
  };

  const toggleMenu = () => {
    if (isMobile) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div 
      className={`h-full flex flex-col bg-card border-r border-border transition-all duration-300 overflow-hidden ${
        isExpanded 
          ? isMobile 
            ? 'fixed inset-0 z-50 w-full' 
            : 'w-64' 
          : 'w-20'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    > 
      {/* Logo y botón de menú móvil */}
      <div className="flex items-center justify-between h-16 border-b border-border px-4 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center ${isMobile ? 'hidden' : 'block'}`}>
            <span className="text-white font-bold">A</span>
          </div>
          {isExpanded && <span className="font-bold text-lg">{profile.name}</span>}
        </div>
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="md:hidden"
          >
            {isExpanded ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        )}
      </div>

      {/* Search */}
      {isExpanded && (
        <div className="p-4 border-b border-border flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Buscar..." className="pl-10" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 scrollbar-none scrollbar-hide">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.title}>
              <Button
                variant="ghost"
                className={`w-full justify-start h-12 ${
                  isExpanded ? 'px-4' : 'px-2 justify-center'
                } hover:bg-accent hover:text-accent-foreground`}
                onClick={() => {
                  if (isMobile) {
                    setIsExpanded(false);
                  }
                  navigate(item.href);
                }}
              >
                <item.icon className="h-5 w-5" />
                {isExpanded && (
                  <>
                    <span className="ml-3">{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border flex-shrink-0">
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <ThemeSwitch />
          </div>
          <Button
            variant="ghost"
            className={`w-full justify-start h-12 ${
              isExpanded ? 'px-4' : 'px-2 justify-center'
            } hover:bg-accent hover:text-accent-foreground`}
          >
            <Settings className="h-5 w-5" />
            {isExpanded && <span className="ml-3">Configuración</span>}
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start h-12 ${
              isExpanded ? 'px-4' : 'px-2 justify-center'
            } hover:bg-destructive hover:text-destructive-foreground`}
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            <X className="h-5 w-5" />
            {isExpanded && <span className="ml-3">Cerrar sesión</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}
