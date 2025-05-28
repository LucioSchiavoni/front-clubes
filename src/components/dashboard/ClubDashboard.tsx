"use client"
import {
  Users,
  Package,
  Calendar,
  Activity,
  Eye,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuthStore } from "@/store/auth"

import AddClubForm from "../forms/AddClubForm"
import { useClub } from "@/hooks/useClub"

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
  const { club, isLoading } = useClub() 

  // Si el usuario no tiene un club asignado, mostrar el formulario de creación
  if (!profile?.data?.clubId) {
    return <AddClubForm />
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!club) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">No se encontró información del club</h2>
      </div>
    )
  }
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{club.name}</h1>
          <p className="text-sm text-muted-foreground">{club.address}</p>
        </div>
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