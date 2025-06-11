import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Order } from "@/hooks/useOrders"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

interface RecentActivityProps {
  orders: Order[]
}

const RecentActivity = ({ orders }: RecentActivityProps) => {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-slate-100">Actividad Reciente</CardTitle>
        <CardDescription className="text-slate-400">Últimas acciones en tu club</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {orders.slice(0, 5).map((order) => (
          <div key={order.id} className="flex items-center space-x-4">
            <div className={`w-2 h-2 rounded-full ${
              order.status === "COMPLETED" ? "bg-green-600" :
              order.status === "PENDING" ? "bg-yellow-600" :
              "bg-red-600"
            }`}></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-200">
                Nueva reserva de {order.user.name}
              </p>
              <p className="text-xs text-slate-400">
                {order.items.map(item => `${item.product.name} (${item.quantity}gr)`).join(', ')} - €{order.total}
              </p>
            </div>
            <div className="text-xs text-slate-400">
              {format(parseISO(order.dateOrder), "d 'de' MMM", { locale: es })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default RecentActivity 