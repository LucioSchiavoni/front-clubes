import {ScrollShadow} from '@heroui/scroll-shadow'
import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Calendar,
  Clock,
  Search,
  Filter,
  ShoppingBag,
  MessageSquare,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Package,
  User,
  Mail,
  Hash,
  DollarSign,
  Loader2,
  X,
} from "lucide-react"
import { useOrdersBySocio } from "@/hooks/useOrders"
import { useAuthStore } from "@/store/auth"
import type { Order } from "@/types/order"
import { format, parseISO, formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { useMutation } from "@tanstack/react-query"
import { cancelOrder } from "@/api/order"
import { useToast } from '@/hooks/use-toast'

export default function OrderHistory() {
  const { profile } = useAuthStore()
  const { orders, isLoading: isLoadingOrders } = useOrdersBySocio(profile?.data?.id || "")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null)

  const {toast} = useToast()

  const cancelOrderMutation = useMutation({
  mutationFn: async (orderId: string) => {
    const response = await cancelOrder(orderId);
    return response.data;
  },
  onSuccess: (data) => {
    toast({
      title: "Orden cancelada",
      description: data.message,
      variant: "default",
    });
    setOrderToCancel(null);
  },
  onError: (error: any) => {
    const msg = error?.response?.data?.message || 'Ocurrió un error';
    toast({
      title: "Error",
      description: msg,
      variant: "destructive",
    });
  },
});


  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4" />
      case "PENDING":
        return <AlertCircle className="h-4 w-4" />
      case "CANCELLED":
        return <XCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/30"
      case "PENDING":
        return "bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/30"
      case "CANCELLED":
        return "bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/20 dark:border-red-500/30"
      default:
        return "bg-gray-500/10 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/20 dark:border-gray-500/30"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "Completado"
      case "PENDING":
        return "Pendiente"
      case "CANCELLED":
        return "Cancelado"
      default:
        return status
    }
  }

  const formatDate = (dateStr: string, timeStr: string) => {
    const date = parseISO(dateStr)
    const formattedDate = format(date, "EEEE d 'de' MMMM", { locale: es })
    const [hours, minutes] = timeStr.split(':').map(Number)
    const time = new Date(date)
    time.setHours(hours, minutes)
    const formattedTime = format(time, "h:mm a", { locale: es })
    const timeAgo = formatDistanceToNow(time, { addSuffix: true, locale: es })
    return { formattedDate, formattedTime, timeAgo }
  }

  const filteredAndSortedOrders = useMemo(() => {
    const filtered = orders.filter((order: Order) => {
      const matchesSearch =
        order.items.some((item) => item.product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        order.id.toString().includes(searchTerm)

      const matchesStatus = statusFilter === "all" || order.status === statusFilter

      return matchesSearch && matchesStatus
    })

    return filtered.sort((a: Order, b: Order) => {
      const dateTimeA = new Date(`${a.dateOrder}T${a.hourOrder}`).getTime()
      const dateTimeB = new Date(`${b.dateOrder}T${b.hourOrder}`).getTime()

      switch (sortBy) {
        case "newest":
          return dateTimeB - dateTimeA
        case "oldest":
          return dateTimeA - dateTimeB
        case "highest":
          return b.total - a.total
        case "lowest":
          return a.total - b.total
        default:
          return dateTimeB - dateTimeA
      }
    })
  }, [orders, searchTerm, statusFilter, sortBy])

  if (isLoadingOrders) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse flex-1"></div>
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-32"></div>
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-32"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }



  return (   
     <ScrollShadow hideScrollBar className="w-full h-[calc(100vh-12rem)]">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text text-transparent">Historial de Pedidos</h1>
          <p className="text-muted-foreground text-sm">
            {orders.length} {orders.length === 1 ? "pedido" : "pedidos"} en total
          </p>
        </div>

        {/* Filters */}
        <Card className="p-3 bg-background border-border">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar pedido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background border-border text-foreground placeholder:text-muted-foreground h-8 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 text-sm bg-background border-border text-foreground">
                  <Filter className="h-3 w-3 mr-2" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="COMPLETED">Completados</SelectItem>
                  <SelectItem value="PENDING">Pendientes</SelectItem>
                  <SelectItem value="CANCELLED">Cancelados</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-8 text-sm bg-background border-border text-foreground">
                  <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem value="newest">Más recientes</SelectItem>
                  <SelectItem value="oldest">Más antiguos</SelectItem>
                  <SelectItem value="highest">Mayor precio</SelectItem>
                  <SelectItem value="lowest">Menor precio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Empty State */}
        {filteredAndSortedOrders.length === 0 && !isLoadingOrders && (
          <Card className="p-6 text-center bg-background border-border">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-base font-semibold text-foreground mb-1">
              {searchTerm || statusFilter !== "all" ? "No se encontraron pedidos" : "No tienes pedidos aún"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Intenta ajustar tus filtros de búsqueda"
                : "Cuando realices tu primer pedido, aparecerá aquí"}
            </p>
            {(searchTerm || statusFilter !== "all") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                }}
                className="border-border text-foreground hover:bg-accent hover:text-accent-foreground"
              >
                Limpiar filtros
              </Button>
            )}
          </Card>
        )}

        {/* Orders List */}
        <div className="space-y-3">
          {filteredAndSortedOrders.map((order: Order) => {
            const { formattedDate, formattedTime, timeAgo } = formatDate(order.dateOrder, order.hourOrder)

            return (
              <Card key={order.id} className="hover:shadow-lg transition-all duration-200 bg-background border-border">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
              <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 text-xs`}>
                {getStatusIcon(order.status)}
                {getStatusText(order.status)}
              </Badge>
              <div className="flex flex-col items-start sm:items-end gap-1 w-full sm:w-auto">
                <div className="flex items-center gap-2 text-xs text-white font-semibold">
            <Calendar className="h-3 w-3" />
            <span className="capitalize">{formattedDate}</span>
            <Clock className="h-3 w-3 ml-2" />
            <span>{formattedTime}</span>
                </div>
                <div className="text-xs text-muted-foreground">
            {timeAgo}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-3 pt-2 space-y-3">
            {/* Items */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Package className="h-3 w-3" />
                Productos ({order.items.length})
              </h4>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                {order.items.map((item: Order["items"][0]) => (
            <div
              key={item.id}
              className="flex justify-between items-center text-xs bg-card text-card-foreground rounded-lg p-2"
            >
              <span className="font-medium text-foreground truncate flex-1 mr-2">{item.product.name}</span>
              <div className="flex items-center gap-2 text-muted-foreground whitespace-nowrap">
                <span>{item.quantity}x</span>
                <span className="font-semibold">${item.product.price}</span>
              </div>
            </div>
                ))}
              </div>
            </div>

            {/* Comment */}
            {order.comment && (
              <>
                <Separator className="bg-border" />
                <div className="space-y-1">
            <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              Comentario
            </h4>
            <p className="text-xs text-muted-foreground bg-card rounded-lg p-2 italic">"{order.comment}"</p>
                </div>
              </>
            )}

              <Separator className="bg-border" />
  
              {/* Total and Actions */}
              <div className="flex justify-between items-center">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">${order.total}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 px-2 border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className="h-3 w-3" />
                    <span className="ml-1 text-xs">Ver</span>
                  </Button>
                  {order.status === "PENDING" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                      onClick={(e) => {
                        e.stopPropagation()
                        setOrderToCancel(order)
                      }}
                    >
                      <X className="h-3 w-3" />
                      <span className="ml-1 text-xs">Cancelar orden</span>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
            )
          })}
        </div>

        {/* Cancel Order Dialog */}
        <Dialog
          open={!!orderToCancel}
          onOpenChange={(open) => {
            if (!open) setOrderToCancel(null)
          }}
        >
          <DialogContent className="max-w-xs bg-background border-border p-4">
            <DialogHeader>
              <DialogTitle>¿Cancelar pedido?</DialogTitle>
              <DialogDescription>
          ¿Estás seguro que deseas cancelar esta orden? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button
          variant="outline"
          size="sm"
          onClick={() => setOrderToCancel(null)}
          className="border-border"
              >
          No, volver
              </Button>
              <Button
              variant="destructive"
              size="sm"
              onClick={() => cancelOrderMutation.mutate(orderToCancel?.id || "")}
              disabled={cancelOrderMutation.isPending}
              >
              {cancelOrderMutation.isPending ? 'Cancelando...' : 'Cancelar orden'}
            </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Order Details Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-lg bg-background border-border p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            {selectedOrder && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-foreground">
                    Detalles completos del pedido
                  </DialogTitle>
                </DialogHeader>

                {isLoadingOrders ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-400" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Order Status */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <Badge className={`${getStatusColor(selectedOrder.status)} flex items-center gap-1`}>
                        {getStatusIcon(selectedOrder.status)}
                        {getStatusText(selectedOrder.status)}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {formatDistanceToNow(parseISO(selectedOrder.createdAt), { addSuffix: true, locale: es })}
                      </div>
                    </div>

                    {/* Order Date and Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Fecha de pedido</span>
                        </div>
                        <p className="font-medium text-foreground">{format(parseISO(selectedOrder.dateOrder), "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Hora de pedido</span>
                        </div>
                        <p className="font-medium text-foreground">{selectedOrder.hourOrder}</p>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Productos ({selectedOrder.items.length})
                      </h4>
                      <div className="space-y-2">
                        {selectedOrder.items.map((item) => (
                          <div key={item.id} className="bg-card text-card-foreground p-3 sm:p-4 rounded-lg">
                            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-full sm:w-16 h-32 sm:h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1 w-full">
                                <h5 className="font-medium text-foreground">{item.product.name}</h5>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.product.description}</p>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-sm">
                                  <div className="flex items-center gap-1">
                                    <span className="text-muted-foreground">THC:</span>
                                    <span className="font-medium text-foreground">{item.product.thc}%</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-muted-foreground">CBD:</span>
                                    <span className="font-medium text-foreground">{item.product.CBD}%</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-muted-foreground">Categoría:</span>
                                    <span className="font-medium text-foreground capitalize">{item.product.category}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-left sm:text-right w-full sm:w-auto mt-2 sm:mt-0">
                                <p className="text-sm text-muted-foreground">Cantidad</p>
                                <p className="font-medium text-foreground">{item.quantity}x</p>
                                <p className="text-sm text-muted-foreground mt-1">Precio</p>
                                <p className="font-medium text-foreground">${item.product.price}</p>
                                <p className="text-sm text-muted-foreground mt-1">Subtotal</p>
                                <p className="font-medium text-emerald-600 dark:text-emerald-400">${item.quantity * item.product.price}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Comment */}
                    {selectedOrder.comment && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Comentario
                        </h4>
                        <p className="text-sm text-muted-foreground bg-card  rounded-lg p-3 italic">
                          "{selectedOrder.comment}"
                        </p>
                      </div>
                    )}

                    {/* Total */}
                    <div className="flex justify-between items-center pt-4 border-t border-border">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total del Pedido</p>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${selectedOrder.total}</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ScrollShadow>
  )
}
