import { useState, useEffect } from "react"
import { Loader2, Users, Package, Calendar, Search, Filter, MoreHorizontal, Edit, Trash2, Eye, UserPlus, PackagePlus, CalendarPlus, Leaf, TrendingUp, DollarSign, CheckCircle2 } from 'lucide-react'
import "@/styles/cursor.css"

import { useAuthStore } from "@/store/auth"
import { useClub } from "@/hooks/useClub"
import { useProducts } from "@/hooks/useProducts"
import { useSocios } from "@/hooks/useSocios"

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import AddClubForm from "../forms/AddClubForm"
import { ProductList } from "@/components/products/ProductList"
import { ProductForm } from "@/components/products/ProductForm"
import AddSocioForm from "@/components/socios/AddSocioForm"
import type { Product } from "@/hooks/useProducts"


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
  const { club, isLoading: isClubLoading } = useClub()
  const { 
    isLoading: isProductsLoading, 
    error: productsError,
    products,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock
  } = useProducts(profile?.data?.clubId)
  const { 
    socios, 
    isLoading: isSociosLoading, 
    error: sociosError,
    getAllSocios,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter
  } = useSocios(club?.id || '')
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isEditProductOpen, setIsEditProductOpen] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)

  useEffect(() => {
    if (club?.id) {
      getAllSocios()
    }
  }, [club?.id])

  const handleCreateProduct = async (formData: FormData) => {
    if (!profile?.data?.clubId) {
      console.error('No hay un club asociado al usuario')
      return
    }

    const productData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      thc: parseFloat(formData.get('thc') as string),
      CBD: parseFloat(formData.get('CBD') as string),
      stock: parseInt(formData.get('stock') as string),
      image: formData.get('image') as File | undefined,
      clubId: profile.data.clubId
    }

    try {
      await createProduct(productData)
      setIsAddProductOpen(false)
    } catch (error) {
      console.error('Error al crear el producto:', error)
    }
  }

  const handleUpdateProduct = async (formData: FormData) => {
    if (!selectedProduct) return

    const productData = {
      id: selectedProduct.id,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      thc: parseFloat(formData.get('thc') as string),
      CBD: parseFloat(formData.get('CBD') as string),
      stock: parseInt(formData.get('stock') as string),
      image: formData.get('image') as File | undefined
    }

    try {
      await updateProduct(productData)
      setIsEditProductOpen(false)
      setSelectedProduct(null)
    } catch (error) {
      console.error('Error al actualizar el producto:', error)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar este producto?')
    if (confirmed) {
      try {
        await deleteProduct(id)
      } catch (error) {
        console.error('Error al eliminar el producto:', error)
      }
    }
  }

  const handleUpdateStock = async (id: string, newStock: number) => {
    try {
      await updateStock(id, newStock)
    } catch (error) {
      console.error('Error al actualizar el stock:', error)
    }
  }

  const handleAddMember = async (formData: FormData) => {
    setShowSuccessAlert(true)
    
    setTimeout(() => {
      setShowSuccessAlert(false)
    }, 3000)

    await getAllSocios()
  }


  if (!profile?.data?.clubId) {
    return <AddClubForm />
  }

  if (isClubLoading) {
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
        {showSuccessAlert && (
          <Alert className="bg-green-50 border-green-200 text-green-800 fixed top-4 right-4 z-50 w-auto min-w-[300px] shadow-lg">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle>¡Éxito!</AlertTitle>
            <AlertDescription>
              El socio ha sido registrado correctamente.
            </AlertDescription>
          </Alert>
        )}

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
              <div className="text-3xl font-bold">{socios.length}</div>
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
                      placeholder="Buscar por nombre o email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-[300px] border-green-200 focus:border-green-500 rounded-xl text-black"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50 rounded-xl">
                        <Filter className="h-4 w-4 mr-2" />
                        Filtros
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="border-green-200 rounded-xl shadow-lg bg-white/95 backdrop-blur-sm">
                      <DropdownMenuLabel className="text-green-800 font-medium">Filtrar por estado</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-green-100" />
                      <DropdownMenuItem 
                        className={`hover:bg-green-50 transition-colors duration-200 ${statusFilter === 'all' ? 'bg-green-50' : ''}`}
                        onClick={() => setStatusFilter('all')}
                      >
                        <div className="flex items-center text-black">
                          <div className="w-2 h-2 rounded-full bg-gray-400 mr-2"></div>
                          Todos
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={`hover:bg-green-50 transition-colors duration-200 ${statusFilter === 'active' ? 'bg-green-50' : ''}`}
                        onClick={() => setStatusFilter('active')}
                      >
                        <div className="flex items-center text-black">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                          Activos
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={`hover:bg-green-50 transition-colors duration-200 ${statusFilter === 'inactive' ? 'bg-green-50' : ''}`}
                        onClick={() => setStatusFilter('inactive')}
                      >
                        <div className="flex items-center text-black">
                          <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                          Inactivos
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Button 
                  onClick={() => setIsAddMemberOpen(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 rounded-xl shadow-lg"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Agregar Socio
                </Button>
              </div>
    {/* Agregar nuevo socio */}
              <AddSocioForm 
                isOpen={isAddMemberOpen}
                onClose={() => setIsAddMemberOpen(false)}
                onSubmit={handleAddMember}
              />

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
                  {isSociosLoading ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                      <span className="ml-2 text-green-700">Cargando socios...</span>
                    </div>
                  ) : sociosError ? (
                    <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg m-4">
                      <p>Error al cargar los socios: {sociosError}</p>
                    </div>
                  ) : socios.length === 0 ? (
                    <div className="p-8 text-center text-green-700">
                      <Users className="h-12 w-12 mx-auto mb-4 text-green-400" />
                      <p className="text-lg font-medium">No hay socios registrados</p>
                      <p className="text-sm text-green-600 mt-2">Comienza agregando tu primer socio</p>
                    </div>
                  ) : (
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow className="bg-gradient-to-r from-green-50 to-emerald-50 hover:bg-green-50/50">
                          <TableHead className="text-green-700 font-semibold py-4">Socio</TableHead>
                          <TableHead className="text-green-700 font-semibold py-4">Teléfono</TableHead>
                          <TableHead className="text-green-700 font-semibold py-4">Dirección</TableHead>
                          <TableHead className="text-green-700 font-semibold py-4">Estado</TableHead>
                          <TableHead className="text-green-700 font-semibold py-4">Fecha Registro</TableHead>
                          <TableHead className="text-right text-green-700 font-semibold py-4">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {socios.map((member) => (
                          <TableRow 
                            key={member.id} 
                            className="hover:bg-green-50/50 transition-colors duration-200 border-b border-green-100"
                          >
                            <TableCell className="py-4">
                              <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                                  <span className="text-xl">👤</span>
                                </div>
                                <div>
                                  <div className="font-medium text-green-800">{member.name}</div>
                                  <div className="text-sm text-green-600">{member.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4 text-green-700">
                              {member.phone ? member.phone : "N/A"}
                            </TableCell>
                            <TableCell className="py-4 text-green-700">
                              {member.address ? member.address : "N/A"}
                            </TableCell>
                      
                            <TableCell className="py-4">
                              <Badge 
                                className={`${
                                  member.active 
                                    ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200" 
                                    : "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200"
                                }`}
                              >
                                {member.active ? "Activo" : "Inactivo"}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-4 text-green-700">
                              {new Date(member.createdAt).toLocaleDateString()}
                            </TableCell>
                
                            <TableCell className="py-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    className="h-8 w-8 p-0 hover:bg-green-100 rounded-full transition-colors duration-200"
                                  >
                                    <MoreHorizontal className="h-4 w-4 text-green-600" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent 
                                  align="end" 
                                  className="border-green-200 rounded-xl shadow-lg bg-white/95 backdrop-blur-sm"
                                >
                                  <DropdownMenuLabel className="text-green-800 font-medium">Acciones</DropdownMenuLabel>
                                  <DropdownMenuItem className="hover:bg-green-50 transition-colors duration-200">
                                    <Eye className="mr-2 h-4 w-4 text-green-600" />
                                    Ver detalles
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="hover:bg-green-50 transition-colors duration-200">
                                    <Edit className="mr-2 h-4 w-4 text-green-600" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-green-100" />
                                  <DropdownMenuItem className="text-red-600 hover:bg-red-50 transition-colors duration-200">
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
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button 
                    onClick={() => setIsAddProductOpen(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 rounded-xl shadow-lg"
                  >
                    <PackagePlus className="h-4 w-4 mr-2" />
                    Agregar Producto
                  </Button>
                </div>
              </div>

              <ProductList 
                products={products}
                isLoading={isProductsLoading}
                error={productsError}
                onEdit={(product) => {
                  setSelectedProduct(product)
                  setIsEditProductOpen(true)
                }}
                onDelete={handleDeleteProduct}
                onUpdateStock={handleUpdateStock}
              />

              <ProductForm
                isOpen={isAddProductOpen}
                onClose={() => setIsAddProductOpen(false)}
                onSubmit={handleCreateProduct}
                title="Agregar Nuevo Producto"
                description="Completa la información del nuevo producto cannábico."
              />

              <ProductForm
                isOpen={isEditProductOpen}
                onClose={() => {
                  setIsEditProductOpen(false)
                  setSelectedProduct(null)
                }}
                onSubmit={handleUpdateProduct}
                product={selectedProduct || undefined}
                title="Editar Producto"
                description="Modifica la información del producto cannábico."
              />
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
