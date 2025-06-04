import { useOrders } from "@/hooks/useOrders"
import { OrderCard } from "./OrderCard"
import { Loader2 } from "lucide-react"

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

interface Order {
  id: string
  userId: string
  total: number
  status: 'PENDING' | 'COMPLETED' | 'CANCELED'
  createdAt: string
  comment?: string
  dateOrder: string
  hourOrder: string
  items: OrderItem[]
}

export const OrderList = () => {
  const { orders, isLoading, error } = useOrders()
 

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
        Error al cargar las órdenes
      </div>
    )
  }

  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No tienes órdenes pendientes
      </div>
    )
  }

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.map((order: Order) => (
        <OrderCard key={order.createdAt} order={order} />
      ))}
    </div>
  )
}
