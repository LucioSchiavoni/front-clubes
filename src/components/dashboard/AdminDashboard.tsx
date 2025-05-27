import {
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/auth"
import { useNavigate } from "react-router-dom"
import AddUserForm from "../forms/AddUserForm"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { profile } = useAuthStore()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showAllModules, setShowAllModules] = useState(false)

  // Verificar si el usuario es SUPERADMIN
  useEffect(() => {
    if (profile?.role !== "SUPERADMIN") {
      navigate("/dashboard")
    }
  }, [profile, navigate])

  const featuredItems = [
    {
      title: "Nombre del club",
      description: "Descripcion del club",
      image: "/placeholder.svg?height=200&width=300",
      stats: { total: "10", active: "Active", growth: "Boton Activar/Desactivar" },
      color: "from-blue-500 to-blue-700"
    },
    {
      title: "Nombre del club",
      description: "Descripcion del club",
      image: "/placeholder.svg?height=200&width=300",
      stats: { total: "15", active: "Active", growth: "Boton Activar/Desactivar" },
      color: "from-purple-500 to-purple-700"
    },
    {
      title: "Nombre del club",
      description: "Descripcion del club",
      image: "/placeholder.svg?height=200&width=300",
      stats: { total: "50", active: "Active", growth: "Boton Activar/Desactivar" },
      color: "from-green-500 to-green-700"
    },
    {
      title: "Nombre del club",
      description: "Descripcion del club",
      image: "/placeholder.svg?height=200&width=300",
      stats: { total: "45", active: "Inactive", growth: "Boton Activar/Desactivar" },
      color: "from-orange-500 to-orange-700"
    }
  ]

  const collections = [
    { name: "Active Users", value: "$41.85", change: "-1.1%", trend: "down", verified: true },
    { name: "Total Orders", value: "$7.38", change: "+1.8%", trend: "up", verified: true },
    { name: "Revenue", value: "$123.3K", change: "-1.3%", trend: "down", verified: true },
    { name: "Products Sold", value: "$2,048.44", change: "+17.9%", trend: "up", verified: true },
    { name: "New Customers", value: "$735.54", change: "+72.2%", trend: "up", verified: true },
    { name: "Conversion Rate", value: "$25.55", change: "-5%", trend: "down", verified: true },
    { name: "Avg Order Value", value: "$35.9K", change: "+8.4%", trend: "up", verified: true },
    { name: "Customer Retention", value: "$2,557.27", change: "+4.3%", trend: "up", verified: true },
    { name: "Support Tickets", value: "$8,040.90", change: "+1.3%", trend: "up", verified: true },
    { name: "Page Views", value: "$403.35", change: "+3.6%", trend: "up", verified: true },
    { name: "Bounce Rate", value: "$25.7K", change: "-0.2%", trend: "down", verified: true },
    { name: "Session Duration", value: "$2,504.54", change: "0%", trend: "neutral", verified: true },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredItems.length)
    }, 5000) 

    return () => clearInterval(timer)
  }, [featuredItems.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredItems.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredItems.length) % featuredItems.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }


  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background text-foreground">
      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6">
        {/* Featured Carousel Section */}
        <div className="mb-6 sm:mb-8">
          <div className="relative">
            <Card className="bg-card border-border overflow-hidden">
              <div
                className={`relative h-48 sm:h-80 bg-gradient-to-r ${featuredItems[currentSlide].color} transition-all duration-500`}
              >
                <div className="absolute inset-0 bg-black/40" />

                {/* Carousel Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
                </button>

                {/* Carousel Content */}
                <div className="relative z-10 p-4 sm:p-8 h-full flex flex-col justify-center">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-2 mb-2 sm:mb-4">
                    <h2 className="text-xl sm:text-3xl font-bold">{featuredItems[currentSlide].title}</h2>
                    <Badge variant="secondary" className="bg-primary w-fit">
                      {featuredItems[currentSlide].stats.active}
                    </Badge>
                  </div>
                  <p className="text-sm sm:text-lg text-muted-foreground mb-4 sm:mb-8">{featuredItems[currentSlide].description}</p>
                  <div className="grid grid-cols-3 gap-4 sm:gap-8">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">TOTAL</p>
                      <p className="text-lg sm:text-2xl font-bold">{featuredItems[currentSlide].stats.total}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">ACTIVOS</p>
                      <p className="text-lg sm:text-2xl font-bold">{featuredItems[currentSlide].stats.active}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">CRECIMIENTO</p>
                      <p className="text-lg sm:text-2xl font-bold text-green-400">{featuredItems[currentSlide].stats.growth}</p>
                    </div>
                  </div>
                </div>

                {/* Background Image */}
                <div className="absolute inset-0 opacity-20">
                  <img
                    src={featuredItems[currentSlide].image || "/placeholder.svg"}
                    alt={featuredItems[currentSlide].title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </Card>

            {/* Carousel Indicators */}
            <div className="flex justify-center space-x-1 sm:space-x-2 mt-2 sm:mt-4">
              {featuredItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "bg-primary scale-110" : "bg-muted hover:bg-muted-foreground"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Management Modules Grid */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold">Clubes</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Administra la activacion de los clubes</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <AddUserForm/>
              {featuredItems.length > 4 && (
                <Button
                  variant="outline"
                  onClick={() => setShowAllModules(!showAllModules)}
                  className="border-border text-foreground hover:bg-accent w-full sm:w-auto"
                >
                  {showAllModules ? "Mostrar menos" : `Ver todo (${featuredItems.length})`}
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {(showAllModules ? featuredItems : featuredItems.slice(0, 4)).map((item, index) => (
              <Card
                key={index}
                className={`bg-card border-border overflow-hidden group hover:bg-accent transition-all duration-300 cursor-pointer ${
                  index === currentSlide ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => goToSlide(index)}
              >
                <div className="aspect-video relative overflow-hidden">
                  <div className={`w-full h-full bg-gradient-to-br ${item.color}`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-background/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-lg sm:text-xl font-bold">{index + 1}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-3 sm:p-4">
                  <h4 className="font-semibold mb-2 flex items-center text-sm sm:text-base">
                    {item.title}
                    <Badge className="ml-2 bg-primary">
                      ✓
                    </Badge>
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">{item.description}</p>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Total: {item.stats.total}</span>
                    <span className="text-green-400">{item.stats.growth}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {!showAllModules && featuredItems.length > 4 && (
            <div className="text-center mt-4">
              <p className="text-xs sm:text-sm text-muted-foreground">4 de {featuredItems.length} clubes</p>
            </div>
          )}
        </div>

        {/* System Metrics */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">Metricas</h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">Indicadores en tiempo real</p>
        </div>
      </main>

      {/* Right Sidebar - Collections */}
      <aside className="w-full lg:w-80 border-t lg:border-l border-border bg-background p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold">Usuarios</h3>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
              Activo
            </Button>
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
              Socios
            </Button>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {collections.map((collection, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <div>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <span className="font-medium text-xs sm:text-sm">{collection.name}</span>
                    {collection.verified && (
                      <Badge variant="secondary" className="bg-primary text-[10px] sm:text-xs">
                        ✓
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-xs sm:text-sm">{collection.value}</div>
                <div
                  className={`text-[10px] sm:text-xs flex items-center ${
                    collection.trend === "up"
                      ? "text-green-400"
                      : collection.trend === "down"
                        ? "text-red-400"
                        : "text-muted-foreground"
                  }`}
                >
                  {collection.trend === "up" && <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />}
                  {collection.trend === "down" && <TrendingDown className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />}
                  {collection.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}

export default AdminDashboard
