import { ShoppingCart as ShoppingCartIcon, Minus, Plus, X, Calendar as CalendarIcon, Clock, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { CartItem } from '@/types/cart'
import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createOrder, type ReservationData } from '@/api/order'
import { useAuthStore } from '@/store/auth'

interface ShoppingCartProps {
  cart: CartItem[]
  cartItemsCount: number
  cartTotal: number
  onUpdateQuantity: (productId: string, newQuantity: number) => void
  onRemoveItem: (productId: string) => void
}

const ShoppingCartComponent = ({ 
  cart, 
  cartItemsCount, 
  cartTotal, 
  onUpdateQuantity, 
  onRemoveItem 
}: ShoppingCartProps) => {
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState<string>()
  const [isDateOpen, setIsDateOpen] = useState(false)
  const [isTimeOpen, setIsTimeOpen] = useState(false)
  const [comment, setComment] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const {profile} = useAuthStore()
  const [alert, setAlert] = useState<{
    type: 'success' | 'error' | null;
    message: string;
    description?: string;
  }>({ type: null, message: '' })

  useEffect(() => {
    if (alert.type) {
      const timer = setTimeout(() => {
        setAlert({ type: null, message: '' })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [alert])

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    setIsDateOpen(false)
  }

  const handleTimeSelect = (selectedTime: string) => {
    setTime(selectedTime)
    setIsTimeOpen(false)
  }

  const { mutate: submitReservation, isPending } = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      setAlert({
        type: 'success',
        message: '¡Reserva creada exitosamente! 🎉',
        description: 'Tu pedido ha sido reservado correctamente.'
      })
      setIsOpen(false)
      setDate(undefined)
      setTime(undefined)
      setComment('')
      cart.forEach(item => onRemoveItem(item.id))
    },
    onError: (error) => {
      setAlert({
        type: 'error',
        message: 'Error al crear la reserva',
        description: error.message || 'Por favor, intenta nuevamente.'
      })
    }
  })

  const handleSubmitReservation = () => {
    if (!date || !time) {
      setAlert({
        type: 'error',
        message: 'Por favor, selecciona una fecha y hora'
      })
      return
    }

    if (!profile?.data?.id) {
      setAlert({
        type: 'error',
        message: 'Error al crear la reserva',
        description: 'No se pudo identificar al usuario. Por favor, inicia sesión nuevamente.'
      })
      return
    }

    const reservationData: ReservationData = {
      userId: profile.data.id,
      items: cart,
      date,
      time,
      comment,
      total: cartTotal
    }
    submitReservation(reservationData)
  }

  return (
    <>
      {alert.type && (
        <div className={cn(
          "fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md animate-in slide-in-from-top-5",
          alert.type === 'success' ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'
        )}>
          <div className="flex items-start gap-3">
            {alert.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <div>
              <p className="font-medium">{alert.message}</p>
              {alert.description && (
                <p className="text-sm opacity-90 mt-1">{alert.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 text-white"
          >
            <ShoppingCartIcon className="w-5 h-5" />
            {cartItemsCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs animate-bounce">
                {cartItemsCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[600px] bg-slate-900/95 backdrop-blur-xl border-white/10">
          <SheetHeader>
            <SheetTitle className="flex items-center space-x-2 text-white">
              <ShoppingCartIcon className="w-5 h-5" />
              <span>Carrito de Reservas</span>
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {cart.length === 0 ? (
              <p className="text-center text-gray-400 py-8">Tu carrito está vacío</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-6 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10"
                  >
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-[80px] h-[80px] rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-base text-white">{item.name}</h4>
                      <p className="text-emerald-400 font-bold text-lg">${item.price}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Button
                        size="icon"
                        variant="outline"
                        className="w-8 h-8 bg-white/10 border-white/20 text-white"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-base font-medium w-18 text-center text-white">
                        {item.quantity} {item.quantity === 1 ? 'gramo' : 'gramos'}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="w-8 h-8 bg-white/10 border-white/20 text-white"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 text-red-400 hover:text-red-300"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Separator className="bg-white/10" />
                <div className="flex justify-between items-center font-bold text-xl text-white">
                  <span>Total:</span>
                  <span className="text-emerald-400">${cartTotal}</span>
                </div>

                {/* Fecha y Hora */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Fecha de Reserva</label>
                      <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20",
                              !date && "text-gray-400"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP", { locale: es }) : "Selecciona una fecha"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-slate-900 border-white/10" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateSelect}
                            initialFocus
                            className="rounded-md border-white/10"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Hora de Reserva</label>
                      <Popover open={isTimeOpen} onOpenChange={setIsTimeOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20",
                              !time && "text-gray-400"
                            )}
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            {time || "Selecciona una hora"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-slate-900 border-white/10" align="start">
                          <div className="grid grid-cols-4 gap-1 p-2">
                            {Array.from({ length: 24 }).map((_, i) => (
                              <Button
                                key={i}
                                variant="ghost"
                                className={cn(
                                  "h-8 w-16 text-sm text-white hover:bg-white/20",
                                  time === `${i}:00` && "bg-emerald-500 hover:bg-emerald-600"
                                )}
                                onClick={() => handleTimeSelect(`${i}:00`)}
                              >
                                {`${i}:00`}
                              </Button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Comentario */}
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Comentario (opcional)</label>
                    <Textarea 
                      placeholder="Agrega algún comentario o instrucción especial..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 min-h-[100px]"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-6 text-lg font-semibold shadow-xl hover:shadow-emerald-500/25 transition-all duration-300"
                  disabled={cart.length === 0 || !date || !time || isPending}
                  onClick={handleSubmitReservation}
                >
                  {isPending ? 'Creando reserva...' : 'Reservar Pedido'}
                </Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default ShoppingCartComponent 