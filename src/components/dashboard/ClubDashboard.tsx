"use client"
import {
  Users,
  Package,
  Calendar,
  TrendingUp,
  Activity,
  Eye,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { useAuthStore } from "@/store/auth"
import { useMutation } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const featuredMetrics = [
  {
    title: "Socios Activos",
    subtitle: "Total de socios",
    icon: Users,
    stats: {
      primary: "0",
      secondary: "socios",
      change: "+0%",
      trend: "up",
    },
  },
  {
    title: "Productos Disponibles",
    subtitle: "En inventario",
    icon: Package,
    stats: {
      primary: "0",
      secondary: "productos",
      change: "0",
      trend: "neutral",
    },
  },
  {
    title: "Reservas del Día",
    subtitle: "Hoy",
    icon: Calendar,
    stats: {
      primary: "0",
      secondary: "reservas",
      change: "+0%",
      trend: "up",
    },
  },
  {
    title: "Reservas Pendientes",
    subtitle: "Esta semana",
    icon: Activity,
    stats: {
      primary: "0",
      secondary: "pendientes",
      change: "+0%",
      trend: "up",
    },
  },
]

const ClubDashboard = () => {
  const { profile } = useAuthStore()
  const [showAlert, setShowAlert] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: ""
  })

  const mutation = useMutation({
    mutationFn: (clubData: typeof formData) => {
   
      return Promise.resolve({ success: true })
    },
    onSuccess: () => {
      setShowAlert(true)
      const timer = setTimeout(() => {
        setShowAlert(false)
      }, 6000)
      return () => clearTimeout(timer)
    }
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  console.log("clubId", profile.data.clubId)

  if (!profile?.data.clubId) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Crear Nuevo Club</h1>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Club *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Ingresa el nombre de tu club"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  required
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe tu club"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección *</Label>
                <Input
                  id="address"
                  required
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Ingresa la dirección del club"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Ingresa el teléfono de contacto"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Creando..." : "Crear Club"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {showAlert && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
            {mutation.isSuccess ? (
              <div className="bg-gray-800 border border-green-500/20 rounded-lg shadow-2xl p-4 min-w-[320px] max-w-md">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-green-400">¡Club creado exitosamente!</h3>
                      <button
                        onClick={() => setShowAlert(false)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">Tu club ha sido creado y está pendiente de aprobación.</p>
                  </div>
                </div>
                <div className="mt-3 w-full bg-gray-700 rounded-full h-1">
                  <div className="bg-green-500 h-1 rounded-full animate-pulse" style={{ width: "100%" }} />
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 border border-red-500/20 rounded-lg shadow-2xl p-4 min-w-[320px] max-w-md">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-red-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-red-400">Error al crear el club</h3>
                      <button
                        onClick={() => setShowAlert(false)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">
                      Hubo un problema al crear el club. Por favor, inténtalo de nuevo.
                    </p>
                  </div>
                </div>
                <div className="mt-3 w-full bg-gray-700 rounded-full h-1">
                  <div className="bg-red-500 h-1 rounded-full animate-pulse" style={{ width: "100%" }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Panel del Club</h1>
        <Button variant="outline">
          <Eye className="mr-2 h-4 w-4" />
          Ver Reporte Completo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {featuredMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.subtitle}</p>
                  <h3 className="text-2xl font-bold">{metric.stats.primary}</h3>
                  <p className="text-sm text-muted-foreground">{metric.stats.secondary}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <metric.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <Badge variant={metric.stats.trend === "up" ? "default" : "destructive"}>
                  {metric.stats.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Reservas Recientes</h3>
            <div className="space-y-4">
              <p className="text-muted-foreground">No hay reservas recientes</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Productos con Bajo Stock</h3>
            <div className="space-y-4">
              <p className="text-muted-foreground">No hay productos con bajo stock</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ClubDashboard