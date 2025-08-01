import { useState } from "react"
import {
  Loader2,
  Calendar,
  Leaf,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { format, parseISO, startOfMonth, endOfMonth } from "date-fns"
import { es } from "date-fns/locale"

import { useAuthStore } from "@/store/auth"
import { useClub } from "@/hooks/useClub"
import { useProducts } from "@/hooks/useProducts"
import { useSocios } from "@/hooks/useSocios"
import { useOrders, type Order } from "@/hooks/useOrders"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import AddClubForm from "../forms/AddClubForm"
import { ProductList } from "@/components/products/ProductList"
import { ProductForm } from "@/components/products/ProductForm"
import AddSocioForm from "@/components/socios/AddSocioForm"
import type { Product } from "@/hooks/useProducts"
import SocioList from "@/components/socios/SocioList"
import DashboardHeader from "@/components/club/header/DashboardHeader"
import FeaturedSection from "@/components/club/FeaturedSection"
import StatsGrid from "@/components/club/StatsGrid"
import RecentActivity from "@/components/club/RecentActivity"
import { OrderList } from "../orders/OrderList"
import OrdersClub from "../orders/OrdersClub"
import { ScrollShadow } from "@heroui/scroll-shadow"

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
    updateStock,
  } = useProducts(profile?.data?.clubId)
  const {
    socios,
    isLoading: isSociosLoading,
    error: sociosError,
    refetch,
    searchTerm,
    setSearchTerm,
  } = useSocios(club?.id || "")
  const { orders, isLoading: isOrdersLoading, error: ordersError } = useOrders(profile?.data?.clubId || '')

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isEditProductOpen, setIsEditProductOpen] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)

  const handleCreateProduct = async (formData: FormData) => {
    if (!profile?.data?.clubId) {
      console.error("No hay un club asociado al usuario")
      return
    }

    const productData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number.parseFloat(formData.get("price") as string),
      category: formData.get("category") as string,
      thc: Number.parseFloat(formData.get("thc") as string),
      CBD: Number.parseFloat(formData.get("CBD") as string),
      stock: Number.parseInt(formData.get("stock") as string),
      image: formData.get("image") as File | undefined,
      clubId: profile.data.clubId,
    }

    try {
      await createProduct(productData)
      setIsAddProductOpen(false)
    } catch (error) {
      console.error("Error al crear el producto:", error)
    }
  }

  const handleUpdateProduct = async (formData: FormData) => {
    if (!selectedProduct) return

    const productData = {
      id: selectedProduct.id,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number.parseFloat(formData.get("price") as string),
      category: formData.get("category") as string,
      thc: Number.parseFloat(formData.get("thc") as string),
      CBD: Number.parseFloat(formData.get("CBD") as string),
      stock: Number.parseInt(formData.get("stock") as string),
      image: formData.get("image") as File | undefined,
    }

    try {
      await updateProduct(productData)
      setIsEditProductOpen(false)
      setSelectedProduct(null)
    } catch (error) {
      console.error("Error al actualizar el producto:", error)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este producto?")
    if (confirmed) {
      try {
        await deleteProduct(id)
      } catch (error) {
        console.error("Error al eliminar el producto:", error)
      }
    }
  }

  const handleUpdateStock = async (id: string, newStock: number) => {
    try {
      await updateStock(id, newStock)
    } catch (error) {
      console.error("Error al actualizar el stock:", error)
    }
  }

  const handleAddMember = async (formData: FormData) => {
    setShowSuccessAlert(true)

    setTimeout(() => {
      setShowSuccessAlert(false)
    }, 3000)

    await refetch()
  }

  const calcularIngresosMes = () => {
    const hoy = new Date()
    const inicioMes = startOfMonth(hoy)
    const finMes = endOfMonth(hoy)

    return orders
      .filter((order: Order) => {
        const fechaOrden = parseISO(order.dateOrder)
        return (
          order.status === "COMPLETED" &&
          fechaOrden >= inicioMes &&
          fechaOrden <= finMes
        )
      })
      .reduce((total: number, order: Order) => total + order.total, 0)
  }

  if (!profile?.data?.clubId) {
    return <AddClubForm />
  }

  if (isClubLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-white dark:bg-slate-800">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-green-700 font-medium">Cargando tu club...</p>
        </div>
      </div>
    )
  }

  if (!club) {
    return (
      <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 min-h-screen">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <Leaf className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">No se encontró información del club</h2>
        </div>
      </div>
    )
  }

  if(club.active === false) {
    return (
      <div className="h-full flex items-center justify-center bg-white dark:bg-slate-800">
        <div className="text-center">
          <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <p className="text-green-700 font-medium">Tu club está inactivo. Por favor, contacta con el administrador.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark:bg-[rgb(18,19,19)] overflow-x-hidden">
      {showSuccessAlert && (
        <Alert className="bg-green-950 border-green-800 text-green-200 fixed top-4 right-4 z-50 w-auto min-w-[300px] shadow-lg">
          <CheckCircle2 className="h-4 w-4 text-green-400" />
          <AlertTitle>¡Éxito!</AlertTitle>
          <AlertDescription>El socio ha sido registrado correctamente.</AlertDescription>
        </Alert>
      )}

      <DashboardHeader 
        clubName={club.name}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddMember={() => setIsAddMemberOpen(true)}
      />

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
        <div className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto">
          <FeaturedSection 
            clubName={club.name}
            totalSocios={socios.length}
            totalProductos={products.length}
            totalReservas={orders.length}
            totalActivos={socios.filter((s) => s.active).length}
            clubImageUrl={club.image || "/default-club-image.png"}
             totalGramos={products.reduce((total, product) => total + (product.stock || 0), 0)}
          />

          <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
            <TabsList className="w-full sm:w-auto tabs-list rounded-lg">
              <TabsTrigger 
                value="overview" 
                className="tabs-trigger"
              >
                Vista General
              </TabsTrigger>
              <TabsTrigger 
                value="products" 
                className="tabs-trigger"
              >
                Productos
              </TabsTrigger>
              <TabsTrigger 
                value="orders" 
                className="tabs-trigger"
              >
                Reservas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 sm:space-y-6">
              <StatsGrid 
                sociosActivos={socios.filter((s) => s.active).length}
                productosDisponibles={products.filter((p) => p.stock > 0).length}
                reservasPendientes={Array.isArray(orders) ? orders.filter((o: Order) => o.status === "PENDING").length : 0}
                ingresosMes={calcularIngresosMes()}
              />
              <RecentActivity orders={Array.isArray(orders) ? orders : []} />
            </TabsContent>

            <TabsContent value="products">
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
                onAddProduct={() => setIsAddProductOpen(true)}
              />
            </TabsContent>

            <TabsContent value="orders">
              <ScrollShadow hideScrollBar className="w-full h-[calc(100vh-12rem)]">
                 <OrdersClub />
              </ScrollShadow>
             
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:w-80 border-t lg:border-t-0 lg:border-l backdrop-blur-sm p-4 sm:p-6 space-y-4 sm:space-y-6 lg:sticky lg:top-[64px] lg:h-[calc(100vh-64px)] lg:overflow-y-auto">
          <SocioList 
            socios={socios}
            isLoading={isSociosLoading}
            onAddMember={handleAddMember}
          />
        </div>
      </div>

      <AddSocioForm 
        isOpen={isAddMemberOpen} 
        onClose={() => setIsAddMemberOpen(false)} 
        onSubmit={handleAddMember} 
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
    </div>
  )
}

export default ClubDashboard
