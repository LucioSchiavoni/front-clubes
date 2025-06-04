import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

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

interface OrderCardProps {
  order: {
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
}

const statusColors = {
  PENDING: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50',
  COMPLETED: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/50',
  CANCELED: 'bg-red-500/20 text-red-500 border-red-500/50'
}

const statusLabels = {
  PENDING: 'Pendiente',
  COMPLETED: 'Completada',
  CANCELED: 'Cancelada'
}

export const OrderCard = ({ order }: OrderCardProps) => {
  const [imageError, setImageError] = useState<Record<string, boolean>>({})

  const handleImageError = (productId: string) => {
    setImageError(prev => ({ ...prev, [productId]: true }))
  }

  const orderNumber = format(new Date(order.createdAt), "ddMMyy", { locale: es })

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold text-white">
          Orden #{orderNumber}
        </CardTitle>
        <Badge className={statusColors[order.status]}>
          {statusLabels[order.status]}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total:</span>
              <span className="text-emerald-400 font-bold">${order.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Fecha de Entrega:</span>
              <span className="text-white">
                {format(new Date(order.dateOrder), "PPP", { locale: es })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Hora:</span>
              <span className="text-white">{order.hourOrder}</span>
            </div>
          </div>

          <Separator className="bg-white/10" />

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-400">Productos Reservados:</h4>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 bg-white/5 rounded-lg">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white/5">
                    {!imageError[item.product.id] ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(item.product.id)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-xs text-center">Sin imagen</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h5 className="font-medium text-white">{item.product.name}</h5>
                    <p className="text-sm text-gray-400 line-clamp-2">{item.product.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-emerald-400">{item.quantity} {item.quantity === 1 ? 'gramo' : 'gramos'}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-white">THC: {item.product.thc}%</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-white">CBD: {item.product.CBD}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs bg-white/5 border-white/10 text-gray-400">
                        {item.product.category}
                      </Badge>
                      <span className="text-emerald-400 text-sm">${item.product.price}/g</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {order.comment && (
            <>
              <Separator className="bg-white/10" />
              <div>
                <span className="text-gray-400">Comentario:</span>
                <p className="text-white mt-1">{order.comment}</p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 