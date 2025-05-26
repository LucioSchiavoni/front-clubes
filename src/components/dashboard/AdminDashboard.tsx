"use client"
import {
  Users,
  ShoppingCart,
  DollarSign,
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
    title: "Usuarios Activos",
    subtitle: "Esta semana",
    image: "/placeholder.svg?height=200&width=300",
    stats: {
      primary: "12,847",
      secondary: "usuarios",
      change: "+15.3%",
      trend: "up",
    },
  },
  {
    title: "Ventas Totales",
    subtitle: "Últimos 30 días",
    image: "/placeholder.svg?height=200&width=300",
    stats: {
      primary: "$284,592",
      secondary: "ingresos",
      change: "+8.7%",
      trend: "up",
    },
  },
  {
    title: "Productos Vendidos",
    subtitle: "Este mes",
    image: "/placeholder.svg?height=200&width=300",
    stats: {
      primary: "3,247",
      secondary: "productos",
      change: "-2.1%",
      trend: "down",
    },
  },
  {
    title: "Conversión",
    subtitle: "Tasa promedio",
    image: "/placeholder.svg?height=200&width=300",
    stats: {
      primary: "4.8%",
      secondary: "conversión",
      change: "+12.4%",
      trend: "up",
    },
  },
]


const AdminDashboard = () => {
  return (
  <div>
    holasdas
  </div>
  )
}

export default AdminDashboard
