"use client"
import {
  Package,
  Calendar,
  History,
  TrendingUp,
  Activity,
  Eye,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const featuredMetrics = [
  {
    title: "Reservas Activas",
    subtitle: "En curso",
    icon: Calendar,
    stats: {
      primary: "0",
      secondary: "reservas",
      change: "0",
      trend: "neutral",
    },
  },
  {
    title: "Productos Disponibles",
    subtitle: "En el club",
    icon: Package,
    stats: {
      primary: "0",
      secondary: "productos",
      change: "0",
      trend: "neutral",
    },
  },
  {
    title: "Reservas Completadas",
    subtitle: "Este mes",
    icon: History,
    stats: {
      primary: "0",
      secondary: "completadas",
      change: "+0%",
      trend: "up",
    },
  },
  {
    title: "Próxima Reserva",
    subtitle: "Fecha",
    icon: Activity,
    stats: {
      primary: "No hay",
      secondary: "reservas",
      change: "0",
      trend: "neutral",
    },
  },
]

const SocioDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mi Panel</h1>
        <Button variant="outline">
          <Eye className="mr-2 h-4 w-4" />
          Ver Historial Completo
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
            <h3 className="text-lg font-semibold mb-4">Mis Reservas Recientes</h3>
            <div className="space-y-4">
              <p className="text-muted-foreground">No hay reservas recientes</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Productos Disponibles</h3>
            <div className="space-y-4">
              <p className="text-muted-foreground">No hay productos disponibles</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SocioDashboard