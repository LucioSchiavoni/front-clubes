import { useOrders, useCompleteOrder } from "@/hooks/useOrders"
import { Loader2, CheckCircle, Clock, User, Calendar } from "lucide-react"
import { useAuthStore } from "@/store/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { useState } from "react"
import type { Order } from "@/hooks/useOrders"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Product {
  id: string
  name: string
  description: string
  image: string
  price: number
  category: string
  thc: number
  CBD: number
  stock: number
  active: boolean
  createdAt: string
  updatedAt: string
  clubId: string
}

interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  product: Product
}

const OrdersClub = () => {
  const { profile } = useAuthStore()
  const { orders, isLoading, error } = useOrders(profile?.data?.clubId || '')
  const completeOrderMutation = useCompleteOrder()
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)

  const handleCompleteOrder = async (orderId: string) => {
    try {
      await completeOrderMutation.mutateAsync(orderId)
      setShowSuccessAlert(true)
      setTimeout(() => {
        setShowSuccessAlert(false)
      }, 3000)
    } catch (error) {
      console.error('Error al completar la orden:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pendiente</Badge>
      case 'COMPLETED':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Error al cargar las reservas: {error.message}
      </div>
    )
  }

  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No hay reservas pendientes
      </div>
    )
  }

  return (
    <>
      {showSuccessAlert && (
        <Alert className="bg-green-950 border-green-800 text-green-200 fixed top-4 right-4 z-50 w-auto min-w-[300px] shadow-lg">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertTitle>¡Éxito!</AlertTitle>
          <AlertDescription>La reserva ha sido marcada como completada.</AlertDescription>
        </Alert>
      )}
      
      <div className="h-[600px] overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {orders.map((order: Order) => (
          <Card key={order.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-emerald-100 text-emerald-600 text-xs">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-sm font-medium">
                      {order.user?.name || 'Usuario'}
                    </CardTitle>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {format(parseISO(order.dateOrder), 'dd MMM yyyy, HH:mm', { locale: es })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(order.status)}
                  {order.status === 'PENDING' && (
                    <Button
                      size="sm"
                      onClick={() => handleCompleteOrder(order.id)}
                      disabled={completeOrderMutation.isPending}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {completeOrderMutation.isPending ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <CheckCircle className="w-3 h-3" />
                      )}
                      <span className="ml-1 text-xs">Completar</span>
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {order.items?.map((item: OrderItem) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="font-medium">{item.product.name}</span>
                      <span className="text-gray-500">x{item.quantity}</span>
                    </div>
                    <span className="font-semibold text-emerald-600">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm">Total:</span>
                    <span className="font-bold text-lg text-emerald-600">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}

export default OrdersClub