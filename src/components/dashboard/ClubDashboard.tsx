"use client"

import { useState } from "react"
import { Loader2, Users, Package, Calendar, Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye, UserPlus, PackagePlus, CalendarPlus, Leaf, TrendingUp, DollarSign, Star } from 'lucide-react'

import { useAuthStore } from "@/store/auth"
import { useClub } from "@/hooks/useClub"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import AddClubForm from "../forms/AddClubForm"

// Datos de ejemplo
const mockMembers = [
  {
    id: 1,
    name: "Juan Pérez",
    email: "juan@email.com",
    phone: "+34 666 123 456",
    memberNumber: "M001",
    joinDate: "2024-01-15",
    status: "active",
    totalPurchases: 450.00,
    avatar: "🧑‍🦱"
  },
  {
    id: 2,
    name: "María García",
    email: "maria@email.com",
    phone: "+34 666 789 012",
    memberNumber: "M002",
    joinDate: "2024-02-20",
    status: "active",
    totalPurchases: 320.00,
    avatar: "👩‍🦰"
  },
  {
    id: 3,
    name: "Carlos López",
    email: "carlos@email.com",
    phone: "+34 666 345 678",
    memberNumber: "M003",
    joinDate: "2024-03-10",
    status: "suspended",
    totalPurchases: 180.00,
    avatar: "👨‍🦲"
  }
]

const mockProducts = [
  {
    id: 1,
    name: "Purple Haze",
    category: "Sativa",
    thc: "22%",
    cbd: "1%",
    price: 12.50,
    stock: 45,
    status: "available",
    rating: 4.8,
    emoji: "🟣"
  },
  {
    id: 2,
    name: "OG Kush",
    category: "Indica",
    thc: "25%",
    cbd: "0.5%",
    price: 15.00,
    stock: 23,
    status: "available",
    rating: 4.9,
    emoji: "🌿"
  },
  {
    id: 3,
    name: "White Widow",
    category: "Híbrida",
    thc: "20%",
    cbd: "2%",
    price: 13.75,
    stock: 0,
    status: "out_of_stock",
    rating: 4.7,
    emoji: "⚪"
  }
]

const mockReservations = [
  {
    id: 1,
    memberName: "Juan Pérez",
    memberNumber: "M001",
    product: "Purple Haze",
    quantity: 3,
    totalAmount: 37.50,
    reservationDate: "2024-01-20",
    pickupDate: "2024-01-22",
    status: "pending"
  },
  {
    id: 2,
    memberName: "María García",
    memberNumber: "M002",
    product: "OG Kush",
    quantity: 2,
    totalAmount: 30.00,
    reservationDate: "2024-01-19",
    pickupDate: "2024-01-21",
    status: "completed"
  },
  {
    id: 3,
    memberName: "Carlos López",
    memberNumber: "M003",
    product: "White Widow",
    quantity: 1,
    totalAmount: 13.75,
    reservationDate: "2024-01-18",
    pickupDate: "2024-01-20",
    status: "cancelled"
  }
]

const ClubDashboard = () => {
  const { profile } = useAuthStore()
  const { club, isLoading } = useClub()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)

  // Si el usuario no tiene un club asignado, mostrar el formulario de creación
  if (!profile?.data?.clubId) {
    return <AddClubForm />
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 cannabis-cursor">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-green-700 font-medium">Cargando tu club...</p>
        </div>
      </div>
    )
  }

  if (!club) {
    return (
      <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 min-h-screen cannabis-cursor">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <Leaf className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">No se encontró información del club</h2>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Activo", className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0" },
      suspended: { label: "Suspendido", className: "bg-gradient-to-r from-red-500 to-pink-500 text-white border-0" },
      pending: { label: "Pendiente", className: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0" },
      completed: { label: "Completado", className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0" },
      cancelled: { label: "Cancelado", className: "bg-gradient-to-r from-red-500 to-pink-500 text-white border-0" },
      available: { label: "Disponible", className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0" },
      out_of_stock: { label: "Sin Stock", className: "bg-gradient-to-r from-gray-500 to-slate-500 text-white border-0" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 cannabis-cursor">
      {/* Custom Cannabis Cursor Styles */}
      <style jsx global>{`
  .cannabis-cursor {
    cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cg%3E%3C!-- Guante estilo Mickey Mouse --%3E%3Cpath d='M18 24c0-2 2-4 4-4s4 2 4 4v16c0 2-2 4-4 4s-4-2-4-4V24z' fill='%23FFFFFF' stroke='%23000000' strokeWidth='1.5'/%3E%3Cpath d='M12 28c0-2 2-4 4-4s4 2 4 4v12c0 2-2 4-4 4s-4-2-4-4V28z' fill='%23FFFFFF' stroke='%23000000' strokeWidth='1.5'/%3E%3Cpath d='M24 28c0-2 2-4 4-4s4 2 4 4v12c0 2-2 4-4 4s-4-2-4-4V28z' fill='%23FFFFFF' stroke='%23000000' strokeWidth='1.5'/%3E%3C!-- Pulgar --%3E%3Cpath d='M8 32c0-2 2-4 4-4s4 2 4 4v4c0 2-2 4-4 4s-4-2-4-4v-4z' fill='%23FFFFFF' stroke='%23000000' strokeWidth='1.5'/%3E%3C!-- Cigarro de Cannabis grande --%3E%3Cpath d='M22 8c0-1.5 1.5-2 3-2h12c1.5 0 3 0.5 3 2v4c0 1.5-1.5 2-3 2H25c-1.5 0-3-0.5-3-2V8z' fill='%23F5F5DC' stroke='%23D4A574' strokeWidth='1'/%3E%3C!-- Punta de cannabis grande y detallada --%3E%3Cpath d='M37 8h6c1.5 0 3 0.5 3 2s-1.5 2-3 2h-6V8z' fill='%2344AA44' stroke='%23228B22' strokeWidth='1'/%3E%3C!-- Detalles de la punta de cannabis --%3E%3Cpath d='M40 8c0 0 1 1 1 2s-1 2-1 2' stroke='%23228B22' strokeWidth='0.5' fill='none'/%3E%3Cpath d='M42 8c0 0 1 1 1 2s-1 2-1 2' stroke='%23228B22' strokeWidth='0.5' fill='none'/%3E%3C!-- Humo más visible --%3E%3Ccircle cx='46' cy='6' r='2' fill='%23E0E0E0' opacity='0.9'/%3E%3Ccircle cx='48' cy='3' r='1.5' fill='%23E0E0E0' opacity='0.7'/%3E%3Ccircle cx='45' cy='1' r='1' fill='%23E0E0E0' opacity='0.5'/%3E%3C/g%3E%3C/svg%3E") 12 12, auto;
  }
  
  .cannabis-cursor-pointer {
    cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cg%3E%3C!-- Guante estilo Mickey Mouse apuntando --%3E%3Cpath d='M18 20c0-2 2-4 4-4s4 2 4 4v20c0 2-2 4-4 4s-4-2-4-4V20z' fill='%23FFFFFF' stroke='%23000000' strokeWidth='1.5'/%3E%3Cpath d='M12 28c0-2 2-4 4-4s4 2 4 4v12c0 2-2 4-4 4s-4-2-4-4V28z' fill='%23FFFFFF' stroke='%23000000' strokeWidth='1.5'/%3E%3Cpath d='M24 28c0-2 2-4 4-4s4 2 4 4v12c0 2-2 4-4 4s-4-2-4-4V28z' fill='%23FFFFFF' stroke='%23000000' strokeWidth='1.5'/%3E%3C!-- Pulgar levantado --%3E%3Cpath d='M8 26c0-2 2-4 4-4s4 2 4 4v4c0 2-2 4-4 4s-4-2-4-4v-4z' fill='%23FFFFFF' stroke='%23000000' strokeWidth='1.5'/%3E%3C!-- Cigarro de Cannabis grande --%3E%3Cpath d='M22 4c0-1.5 1.5-2 3-2h12c1.5 0 3 0.5 3 2v4c0 1.5-1.5 2-3 2H25c-1.5 0-3-0.5-3-2V4z' fill='%23F5F5DC' stroke='%23D4A574' strokeWidth='1'/%3E%3C!-- Punta de cannabis grande y detallada --%3E%3Cpath d='M37 4h6c1.5 0 3 0.5 3 2s-1.5 2-3 2h-6V4z' fill='%2344AA44' stroke='%23228B22' strokeWidth='1'/%3E%3C!-- Detalles de la punta de cannabis --%3E%3Cpath d='M40 4c0 0 1 1 1 2s-1 2-1 2' stroke='%23228B22' strokeWidth='0.5' fill='none'/%3E%3Cpath d='M42 4c0 0 1 1 1 2s-1 2-1 2' stroke='%23228B22' strokeWidth='0.5' fill='none'/%3E%3C!-- Humo más visible --%3E%3Ccircle cx='46' cy='2' r='2' fill='%23E0E0E0' opacity='0.9'/%3E%3Ccircle cx='48' cy='0' r='1.5' fill='%23E0E0E0' opacity='0.7'/%3E%3C/g%3E%3C/svg%3E") 12 12, pointer;
  }
  
  .cannabis-cursor-grab {
    cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cg%3E%3C!-- Guante cerrado estilo Mickey Mouse --%3E%3Cpath d='M12 24c0-2 2-4 4-4h12c2 0 4 2 4 4v12c0 2-2 4-4 4H16c-2 0-4-2-4-4V24z' fill='%23FFFFFF' stroke='%23000000' strokeWidth='1.5'/%3E%3C!-- Pulgar --%3E%3Cpath d='M8 28c0-2 2-4 4-4s4 2 4 4v4c0 2-2 4-4 4s-4-2-4-4v-4z' fill='%23FFFFFF' stroke='%23000000' strokeWidth='1.5'/%3E%3C!-- Cigarro de Cannabis sostenido --%3E%3Cpath d='M16 20h16c1.5 0 3 0.5 3 2v2c0 1.5-1.5 2-3 2H16c-1.5 0-3-0.5-3-2v-2c0-1.5 1.5-2 3-2z' fill='%23F5F5DC' stroke='%23D4A574' strokeWidth='1'/%3E%3C!-- Punta de cannabis grande y detallada --%3E%3Cpath d='M32 20h6c1.5 0 3 0.5 3 2s-1.5 2-3 2h-6v-4z' fill='%2344AA44' stroke='%23228B22' strokeWidth='1'/%3E%3C!-- Detalles de la punta de cannabis --%3E%3Cpath d='M35 20c0 0 1 1 1 2s-1 2-1 2' stroke='%23228B22' strokeWidth='0.5' fill='none'/%3E%3Cpath d='M37 20c0 0 1 1 1 2s-1 2-1 2' stroke='%23228B22' strokeWidth='0.5' fill='none'/%3E%3C!-- Humo más visible --%3E%3Ccircle cx='42' cy='18' r='2' fill='%23E0E0E0' opacity='0.9'/%3E%3Ccircle cx='44' cy='15' r='1.5' fill='%23E0E0E0' opacity='0.7'/%3E%3C/g%3E%3C/svg%3E") 12 12, grab;
  }

  /* Apply different cursors to different elements */
  .cannabis-cursor button,
  .cannabis-cursor a,
  .cannabis-cursor [role="button"],
  .cannabis-cursor .hover\\:bg-green-50,
  .cannabis-cursor .hover\\:bg-green-100 {
    cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cg%3E%3C!-- Guante estilo Mickey Mouse apuntando --%3E%3Cpath d='M18 20c0-2 2-4 4-4s4 2 4 4v20c0 2-2 4-4 4s-4-2-4-4V20z' fill='%23FFFFFF' stroke='%23000000' strokeWidth='1.5'/%3E%3Cpath d='M12 28c0-2 2-4 4-4s4 2 4 4v12c0 2-2 4-4 4s-4-2-4-4V28z' fill='%23FFFFFF' stroke='%23000000' strokeWidth='1.5'/%3E%3Cpath d='M24 28c0-2 2-4 4-4s4 2 4 4v12c0 2-2 4-4 4s-4-2-4-4V28z' fill='%23FFFFFF' stroke='%23000000' strokeWidth='1.5'/%3E%3C!-- Pulgar levantado --%3E%3Cpath d='M8 26c0-2 2-4 4-4s4 2 4 4v4c0 2-2 4-4 4s-4-2-4-4v-4z' fill='%23FFFFFF' stroke='%23000000' strokeWidth='1.5'/%3E%3C!-- Cigarro de Cannabis grande --%3E%3Cpath d='M22 4c0-1.5 1.5-2 3-2h12c1.5 0 3 0.5 3 2v4c0 1.5-1.5 2-3 2H25c-1.5 0-3-0.5-3-2V4z' fill='%23F5F5DC' stroke='%23D4A574' strokeWidth='1'/%3E%3C!-- Punta de cannabis grande y detallada --%3E%3Cpath d='M37 4h6c1.5 0 3 0.5 3 2s-1.5 2-3 2h-6V4z' fill='%2344AA44' stroke='%23228B22' strokeWidth='1'/%3E%3C!-- Detalles de la punta de cannabis --%3E%3Cpath d='M40 4c0 0 1 1 1 2s-1 2-1 2' stroke='%23228B22' strokeWidth='0.5' fill='none'/%3E%3Cpath d='M42 4c0 0 1 1 1 2s-1 2-1 2' stroke='%23228B22' strokeWidth='0.5' fill='none'/%3E%3C!-- Humo más visible --%3E%3Ccircle cx='46' cy='2' r='2' fill='%23E0E0E0' opacity='0.9'/%3E%3Ccircle cx='48' cy='0' r='1.5' fill='%23E0E0E0' opacity='0.7'/%3E%3C/g%3E%3C/svg%3E") 12 12, pointer !important;
  }

  .cannabis-cursor input,
  .cannabis-cursor textarea,
  .cannabis-cursor [contenteditable="true"] {
    cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cg%3E%3C!-- Guante estilo Mickey Mouse --%3E%3Cpath d='M18 24c0-2 2-4 4-4s4 2 4 4v16c0 2-2 4-4 4s-4-2-4-4V24z' fill='%23FFFFFF' stroke='%23000000' strokeWidth='1.5'/%3E%3Cpath d='M12 28c0-2 2-4 4-4s4 2 4 4v12c0 2-2 4-4 4s-4-2-4-4V28z' fill='%23FFFFFF' stroke='%23000000' strokeWidth='1.5'/%3E%3Cpath d='M24 28c0-2 2-4 4-4s4 2 4 4v12c0 2-2 4-4 4s-4-2-4-4V28z' fill='%23FFFFFF' stroke='%23000000' strokeWidth='1.5'/%3E%3C!-- Pulgar --%3E%3Cpath d='M8 32c0-2 2-4 4-4s4 2 4 4v4c0 2-2 4-4 4s-4-2-4-4v-4z' fill='%23FFFFFF' stroke='%23000000' strokeWidth='1.5'/%3E%3C!-- Cigarro de Cannabis grande --%3E%3Cpath d='M22 8c0-1.5 1.5-2 3-2h12c1.5 0 3 0.5 3 2v4c0 1.5-1.5 2-3 2H25c-1.5 0-3-0.5-3-2V8z' fill='%23F5F5DC' stroke='%23D4A574' strokeWidth='1'/%3E%3C!-- Punta de cannabis grande y detallada --%3E%3Cpath d='M37 8h6c1.5 0 3 0.5 3 2s-1.5 2-3 2h-6V8z' fill='%2344AA44' stroke='%23228B22' strokeWidth='1'/%3E%3C!-- Detalles de la punta de cannabis --%3E%3Cpath d='M40 8c0 0 1 1 1 2s-1 2-1 2' stroke='%23228B22' strokeWidth='0.5' fill='none'/%3E%3Cpath d='M42 8c0 0 1 1 1 2s-1 2-1 2' stroke='%23228B22' strokeWidth='0.5' fill='none'/%3E%3C!-- Línea de cursor de texto --%3E%3Cline x1='46' y1='12' x2='46' y2='24' stroke='%23000000' strokeWidth='2'/%3E%3C!-- Humo más visible --%3E%3Ccircle cx='46' cy='6' r='2' fill='%23E0E0E0' opacity='0.9'/%3E%3Ccircle cx='48' cy='3' r='1.5' fill='%23E0E0E0' opacity='0.7'/%3E%3C/g%3E%3C/svg%3E") 12 12, text !important;
  }

  /* Hover effects with cannabis cursor */
  .cannabis-cursor .hover\\:bg-green-50:hover,
  .cannabis-cursor .hover\\:bg-green-100:hover,
  .cannabis-cursor button:active,
  .cannabis-cursor a:active {
    cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cg%3E%3C!-- Guante cerrado estilo Mickey Mouse --%3E%3Cpath d='M12 24c0-2 2-4 4-4h12c2 0 4 2 4 4v12c0 2-2 4-4 4H16c-2 0-4-2-4-4V24z' fill='%23FFFFFF' stroke='%23000000' strokeWidth='1.5'/%3E%3C!-- Pulgar --%3E%3Cpath d='M8 28c0-2 2-4 4-4s4 2 4 4v4c0 2-2 4-4 4s-4-2-4-4v-4z' fill='%23FFFFFF' stroke='%23000000' strokeWidth='1.5'/%3E%3C!-- Cigarro de Cannabis sostenido --%3E%3Cpath d='M16 20h16c1.5 0 3 0.5 3 2v2c0 1.5-1.5 2-3 2H16c-1.5 0-3-0.5-3-2v-2c0-1.5 1.5-2 3-2z' fill='%23F5F5DC' stroke='%23D4A574' strokeWidth='1'/%3E%3C!-- Punta de cannabis grande y detallada --%3E%3Cpath d='M32 20h6c1.5 0 3 0.5 3 2s-1.5 2-3 2h-6v-4z' fill='%2344AA44' stroke='%23228B22' strokeWidth='1'/%3E%3C!-- Detalles de la punta de cannabis --%3E%3Cpath d='M35 20c0 0 1 1 1 2s-1 2-1 2' stroke='%23228B22' strokeWidth='0.5' fill='none'/%3E%3Cpath d='M37 20c0 0 1 1 1 2s-1 2-1 2' stroke='%23228B22' strokeWidth='0.5' fill='none'/%3E%3C!-- Humo más visible --%3E%3Ccircle cx='42' cy='18' r='2' fill='%23E0E0E0' opacity='0.9'/%3E%3Ccircle cx='44' cy='15' r='1.5' fill='%23E0E0E0' opacity='0.7'/%3E%3C/g%3E%3C/svg%3E") 12 12, grab !important;
  }
`}</style>

      {/* Cannabis Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-6xl">🌿</div>
        <div className="absolute top-32 right-20 text-4xl">🍃</div>
        <div className="absolute bottom-20 left-32 text-5xl">🌱</div>
        <div className="absolute bottom-40 right-10 text-3xl">🌿</div>
        <div className="absolute top-1/2 left-1/4 text-4xl">🍃</div>
        <div className="absolute top-1/3 right-1/3 text-5xl">🌱</div>
      </div>

      <div className="relative flex-1 space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Cannabis Club Dashboard
                </h1>
                <p className="text-green-700 font-medium">
                  Gestiona tu club cannábico de manera profesional 🌿
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-4 py-2 text-sm font-medium">
              🏢 {club?.name || "Green Paradise Club"}
            </Badge>
            <div className="p-2 bg-white rounded-full shadow-lg">
              <div className="text-2xl">🌿</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 border-0 shadow-xl text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 text-6xl opacity-20">👥</div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-green-100">Total Socios</CardTitle>
              <Users className="h-5 w-5 text-green-200" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold">{mockMembers.length}</div>
              <p className="text-xs text-green-200 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2 desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 border-0 shadow-xl text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 text-6xl opacity-20">🌿</div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-emerald-100">Productos</CardTitle>
              <Package className="h-5 w-5 text-emerald-200" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold">{mockProducts.length}</div>
              <p className="text-xs text-emerald-200 flex items-center mt-1">
                <Leaf className="h-3 w-3 mr-1" />
                {mockProducts.filter(p => p.status === 'available').length} disponibles
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-500 to-cyan-600 border-0 shadow-xl text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 text-6xl opacity-20">📅</div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-teal-100">Reservas Activas</CardTitle>
              <Calendar className="h-5 w-5 text-teal-200" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold">
                {mockReservations.filter(r => r.status === 'pending').length}
              </div>
              <p className="text-xs text-teal-200 flex items-center mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                Pendientes de recoger
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-orange-600 border-0 shadow-xl text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 text-6xl opacity-20">💰</div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-yellow-100">Ingresos del Mes</CardTitle>
              <DollarSign className="h-5 w-5 text-yellow-200" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold">€2,450</div>
              <p className="text-xs text-yellow-200 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15% desde el mes pasado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-green-100">
          <Tabs defaultValue="members" className="space-y-6 p-6">
            <TabsList className="bg-gradient-to-r from-green-100 to-emerald-100 p-1 rounded-2xl border border-green-200">
              <TabsTrigger 
                value="members" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-xl font-medium"
              >
                👥 Socios
              </TabsTrigger>
              <TabsTrigger 
                value="products"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-xl font-medium"
              >
                🌿 Productos
              </TabsTrigger>
              <TabsTrigger 
                value="reservations"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-xl font-medium"
              >
                📅 Reservas
              </TabsTrigger>
            </TabsList>

            {/* Members Tab */}
            <TabsContent value="members" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                    <Input
                      placeholder="Buscar socios..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-[300px] border-green-200 focus:border-green-500 rounded-xl"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50 rounded-xl">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </div>
                <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 rounded-xl shadow-lg">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Agregar Socio
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] rounded-2xl border-green-200">
                    <DialogHeader>
                      <DialogTitle className="text-green-800 flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg mr-3">
                          <UserPlus className="h-5 w-5 text-green-600" />
                        </div>
                        Agregar Nuevo Socio
                      </DialogTitle>
                      <DialogDescription className="text-green-600">
                        Completa la información del nuevo socio del club cannábico.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right text-green-700 font-medium">
                          Nombre
                        </Label>
                        <Input id="name" className="col-span-3 border-green-200 focus:border-green-500 rounded-lg" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right text-green-700 font-medium">
                          Email
                        </Label>
                        <Input id="email" type="email" className="col-span-3 border-green-200 focus:border-green-500 rounded-lg" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right text-green-700 font-medium">
                          Teléfono
                        </Label>
                        <Input id="phone" className="col-span-3 border-green-200 focus:border-green-500 rounded-lg" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="dni" className="text-right text-green-700 font-medium">
                          DNI
                        </Label>
                        <Input id="dni" className="col-span-3 border-green-200 focus:border-green-500 rounded-lg" />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsAddMemberOpen(false)} className="border-green-200 text-green-700 hover:bg-green-50 rounded-lg">
                        Cancelar
                      </Button>
                      <Button onClick={() => setIsAddMemberOpen(false)} className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg">
                        Agregar Socio
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Card className="border-green-200 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                  <CardTitle className="text-green-800 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Lista de Socios
                  </CardTitle>
                  <CardDescription className="text-green-600">
                    Gestiona los socios de tu club cannábico
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-green-50/50">
                        <TableHead className="text-green-700 font-semibold">Socio</TableHead>
                        <TableHead className="text-green-700 font-semibold">Contacto</TableHead>
                        <TableHead className="text-green-700 font-semibold">Número</TableHead>
                        <TableHead className="text-green-700 font-semibold">Fecha Ingreso</TableHead>
                        <TableHead className="text-green-700 font-semibold">Estado</TableHead>
                        <TableHead className="text-green-700 font-semibold">Total Compras</TableHead>
                        <TableHead className="text-right text-green-700 font-semibold">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockMembers.map((member) => (
                        <TableRow key={member.id} className="hover:bg-green-50/50 transition-colors">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="text-2xl">{member.avatar}</div>
                              <div>
                                <div className="font-medium text-green-800">{member.name}</div>
                                <div className="text-sm text-green-600">{member.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-green-700">{member.phone}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              {member.memberNumber}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-green-700">{member.joinDate}</TableCell>
                          <TableCell>{getStatusBadge(member.status)}</TableCell>
                          <TableCell className="font-semibold text-green-800">€{member.totalPurchases.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-green-100">
                                  <MoreHorizontal className="h-4 w-4 text-green-600" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="border-green-200 rounded-xl">
                                <DropdownMenuLabel className="text-green-800">Acciones</DropdownMenuLabel>
                                <DropdownMenuItem className="hover:bg-green-50">
                                  <Eye className="mr-2 h-4 w-4 text-green-600" />
                                  Ver detalles
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-green-50">
                                  <Edit className="mr-2 h-4 w-4 text-green-600" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600 hover:bg-red-50">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                    <Input
                      placeholder="Buscar productos..."
                      className="pl-10 w-[300px] border-green-200 focus:border-green-500 rounded-xl"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50 rounded-xl">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </div>
                <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 rounded-xl shadow-lg">
                      <PackagePlus className="h-4 w-4 mr-2" />
                      Agregar Producto
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] rounded-2xl border-green-200">
                    <DialogHeader>
                      <DialogTitle className="text-green-800 flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg mr-3">
                          <PackagePlus className="h-5 w-5 text-green-600" />
                        </div>
                        Agregar Nuevo Producto
                      </DialogTitle>
                      <DialogDescription className="text-green-600">
                        Completa la información del nuevo producto cannábico.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="productName" className="text-right text-green-700 font-medium">
                          Nombre
                        </Label>
                        <Input id="productName" className="col-span-3 border-green-200 focus:border-green-500 rounded-lg" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right text-green-700 font-medium">
                          Categoría
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3 border-green-200 focus:border-green-500 rounded-lg">
                            <SelectValue placeholder="Seleccionar categoría" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-green-200">
                            <SelectItem value="sativa">🌱 Sativa</SelectItem>
                            <SelectItem value="indica">🍃 Indica</SelectItem>
                            <SelectItem value="hibrida">🌿 Híbrida</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="thc" className="text-right text-green-700 font-medium">
                          THC %
                        </Label>
                        <Input id="thc" className="col-span-3 border-green-200 focus:border-green-500 rounded-lg" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="cbd" className="text-right text-green-700 font-medium">
                          CBD %
                        </Label>
                        <Input id="cbd" className="col-span-3 border-green-200 focus:border-green-500 rounded-lg" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right text-green-700 font-medium">
                          Precio €
                        </Label>
                        <Input id="price" type="number" step="0.01" className="col-span-3 border-green-200 focus:border-green-500 rounded-lg" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="stock" className="text-right text-green-700 font-medium">
                          Stock
                        </Label>
                        <Input id="stock" type="number" className="col-span-3 border-green-200 focus:border-green-500 rounded-lg" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right text-green-700 font-medium">
                          Descripción
                        </Label>
                        <Textarea id="description" className="col-span-3 border-green-200 focus:border-green-500 rounded-lg" />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsAddProductOpen(false)} className="border-green-200 text-green-700 hover:bg-green-50 rounded-lg">
                        Cancelar
                      </Button>
                      <Button onClick={() => setIsAddProductOpen(false)} className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg">
                        Agregar Producto
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Card className="border-green-200 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                  <CardTitle className="text-green-800 flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Catálogo de Productos
                  </CardTitle>
                  <CardDescription className="text-green-600">
                    Gestiona el inventario de productos cannábicos del club
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-green-50/50">
                        <TableHead className="text-green-700 font-semibold">Producto</TableHead>
                        <TableHead className="text-green-700 font-semibold">Categoría</TableHead>
                        <TableHead className="text-green-700 font-semibold">THC/CBD</TableHead>
                        <TableHead className="text-green-700 font-semibold">Precio</TableHead>
                        <TableHead className="text-green-700 font-semibold">Stock</TableHead>
                        <TableHead className="text-green-700 font-semibold">Rating</TableHead>
                        <TableHead className="text-green-700 font-semibold">Estado</TableHead>
                        <TableHead className="text-right text-green-700 font-semibold">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockProducts.map((product) => (
                        <TableRow key={product.id} className="hover:bg-green-50/50 transition-colors">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="text-2xl">{product.emoji}</div>
                              <div>
                                <div className="font-medium text-green-800">{product.name}</div>
                                <div className="text-sm text-green-600">Cepa premium</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              {product.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-green-700">
                            <div className="text-sm">
                              <div>THC: {product.thc}</div>
                              <div>CBD: {product.cbd}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-green-800">€{product.price.toFixed(2)}</TableCell>
                          <TableCell className="text-green-700">{product.stock}g</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium text-green-800">{product.rating}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(product.status)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-green-100">
                                  <MoreHorizontal className="h-4 w-4 text-green-600" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="border-green-200 rounded-xl">
                                <DropdownMenuLabel className="text-green-800">Acciones</DropdownMenuLabel>
                                <DropdownMenuItem className="hover:bg-green-50">
                                  <Eye className="mr-2 h-4 w-4 text-green-600" />
                                  Ver detalles
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-green-50">
                                  <Edit className="mr-2 h-4 w-4 text-green-600" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600 hover:bg-red-50">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reservations Tab */}
            <TabsContent value="reservations" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                    <Input
                      placeholder="Buscar reservas..."
                      className="pl-10 w-[300px] border-green-200 focus:border-green-500 rounded-xl"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50 rounded-xl">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </div>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 rounded-xl shadow-lg">
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Nueva Reserva
                </Button>
              </div>

              <Card className="border-green-200 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                  <CardTitle className="text-green-800 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Reservas
                  </CardTitle>
                  <CardDescription className="text-green-600">
                    Gestiona las reservas de productos de los socios
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-green-50/50">
                        <TableHead className="text-green-700 font-semibold">ID</TableHead>
                        <TableHead className="text-green-700 font-semibold">Socio</TableHead>
                        <TableHead className="text-green-700 font-semibold">Producto</TableHead>
                        <TableHead className="text-green-700 font-semibold">Cantidad</TableHead>
                        <TableHead className="text-green-700 font-semibold">Total</TableHead>
                        <TableHead className="text-green-700 font-semibold">Fecha Reserva</TableHead>
                        <TableHead className="text-green-700 font-semibold">Fecha Recogida</TableHead>
                        <TableHead className="text-green-700 font-semibold">Estado</TableHead>
                        <TableHead className="text-right text-green-700 font-semibold">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockReservations.map((reservation) => (
                        <TableRow key={reservation.id} className="hover:bg-green-50/50 transition-colors">
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              #{reservation.id}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-green-800">{reservation.memberName}</div>
                              <div className="text-sm text-green-600">{reservation.memberNumber}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-green-700">{reservation.product}</TableCell>
                          <TableCell className="text-green-700">{reservation.quantity}g</TableCell>
                          <TableCell className="font-semibold text-green-800">€{reservation.totalAmount.toFixed(2)}</TableCell>
                          <TableCell className="text-green-700">{reservation.reservationDate}</TableCell>
                          <TableCell className="text-green-700">{reservation.pickupDate}</TableCell>
                          <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-green-100">
                                  <MoreHorizontal className="h-4 w-4 text-green-600" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="border-green-200 rounded-xl">
                                <DropdownMenuLabel className="text-green-800">Acciones</DropdownMenuLabel>
                                <DropdownMenuItem className="hover:bg-green-50">
                                  <Eye className="mr-2 h-4 w-4 text-green-600" />
                                  Ver detalles
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-green-50">
                                  <Edit className="mr-2 h-4 w-4 text-green-600" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600 hover:bg-red-50">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Cancelar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default ClubDashboard
