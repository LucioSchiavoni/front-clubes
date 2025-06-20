import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Order } from "@/hooks/useOrders"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

interface RecentActivityProps {
  orders: Order[]
}

const RecentActivity = ({ orders }: RecentActivityProps) => {
  return (
    <Card className="dark:bg-slate-900 backdrop-invert backdrop-opacity-40">
      <CardHeader>
        <CardTitle className="dark:bg-white text-xl">Actividad Reciente</CardTitle>
        <CardDescription className="dark:bg-slate-200">Últimas acciones en tu club</CardDescription>
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
              <p className=" font-medium dark:text-slate-200">
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