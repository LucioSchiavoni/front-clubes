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
import { format, isSameDay } from "date-fns"
import { es } from "date-fns/locale"
import type { CartItem } from '@/types/cart'
import { useState, useEffect } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { createOrder, type ReservationData } from '@/api/order'
import { useAuthStore } from '@/store/auth'
import { getSchedules } from '@/api/clubDate'

interface Schedule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  isActive: boolean;
  dayName: string;
}

interface ShoppingCartProps {
  cart: CartItem[]
  cartItemsCount: number
  cartTotal: number
  onUpdateQuantity: (productId: string, newQuantity: number) => void
  onRemoveItem: (productId: string) => void
  clubId: string
}

const ShoppingCartComponent = ({ 
  cart, 
  cartItemsCount, 
  cartTotal, 
  onUpdateQuantity, 
  onRemoveItem,
  clubId
}: ShoppingCartProps) => {
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState<string>()
  const [isDateOpen, setIsDateOpen] = useState(false)
  const [isTimeOpen, setIsTimeOpen] = useState(false)
  const [comment, setComment] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const {profile} = useAuthStore()
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [alert, setAlert] = useState<{
    type: 'success' | 'error' | null;
    message: string;
    description?: string;
  }>({ type: null, message: '' })


  // Obtener horarios del club
  const { data: schedulesData, isLoading: isLoadingSchedules } = useQuery({
    queryKey: ['schedules', clubId],
    queryFn: () => {
      if (!clubId) {
        console.error('No hay clubId disponible')
        return Promise.reject('No hay clubId disponible')
      }
      return getSchedules(clubId)
    },
    enabled: !!clubId
  })



  // Generar horarios disponibles basados en el horario del club
  const generateAvailableTimes = (startTime: string, endTime: string) => {
    const times: string[] = []
    const [startHour] = startTime.split(':').map(Number)
    const [endHour] = endTime.split(':').map(Number)
    
    for (let hour = startHour; hour < endHour; hour++) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`
      times.push(timeString)
    }
    return times
  }

  // Función para deshabilitar fechas no disponibles
  const disabledDays = (date: Date) => {
    if (!schedulesData?.data?.data || isLoadingSchedules) {

      return false; // Permitimos todas las fechas mientras se cargan los datos
    }

    const jsDay = date.getDay();
    const dayOfWeek = jsDay === 0 ? 7 : jsDay;
  
    
    // Accedemos correctamente a los datos del array anidado
    const schedules = Array.isArray(schedulesData.data.data) ? schedulesData.data.data : [];
    
    const isDisabled = !schedules.some(
      (schedule: Schedule) => {
        return schedule.dayOfWeek === dayOfWeek && schedule.isActive;
      }
    );
    
    return isDisabled;
  }

  // Verificar disponibilidad cuando se selecciona una fecha
  useEffect(() => {
    if (date && schedulesData?.data?.data) {
    
      
      const jsDay = date.getDay();
      const dayOfWeek = jsDay === 0 ? 7 : jsDay;
      
      
      // Accedemos correctamente a los datos del array anidado
      const schedules = Array.isArray(schedulesData.data.data) ? schedulesData.data.data : [];
      
      const scheduleForDay = schedules.find(
        (schedule: Schedule) => {
          return schedule.dayOfWeek === dayOfWeek && schedule.isActive;
        }
      );


      if (scheduleForDay) {
        const times = generateAvailableTimes(scheduleForDay.startTime, scheduleForDay.endTime);
        setAvailableTimes(times);
      } else {
        setAvailableTimes([]);
        setAlert({
          type: 'error',
          message: 'No hay horarios disponibles para esta fecha'
        });
      }
    }
  }, [date, schedulesData])

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
    setTime(undefined)
    setIsDateOpen(false)
  }

  const handleTimeSelect = (selectedTime: string) => {
    setTime(selectedTime)
    setIsTimeOpen(false)
  }

  const queryClient = useQueryClient()

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
      queryClient.invalidateQueries({queryKey: ['orders']})
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
          "fixed top-4 right-4 z-[70] p-4 rounded-lg shadow-lg max-w-md animate-in slide-in-from-top-5",
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
            className="relative bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground z-[70]"
          >
            <ShoppingCartIcon className="w-5 h-5" />
            {cartItemsCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs animate-bounce">
                {cartItemsCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:w-[600px] bg-background border-border p-4 sm:p-6 flex flex-col h-full">
          <SheetHeader>
            <SheetTitle className="flex items-center space-x-2 text-foreground">
              <ShoppingCartIcon className="w-5 h-5" />
              <span>Carrito de Reservas</span>
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 flex-1 overflow-y-auto pb-4">
            {cart.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Tu carrito está vacío</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 p-3 sm:p-4 bg-card text-card-foreground rounded-xl border border-border"
                  >
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full sm:w-[80px] h-40 sm:h-[80px] rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0 w-full">
                      <h4 className="font-medium text-base text-foreground">{item.name}</h4>
                      <p className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">${item.price}</p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 sm:gap-4">
                      <Button
                        size="icon"
                        variant="outline"
                        className="w-7 h-7 sm:w-8 sm:h-8 bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-sm sm:text-base font-medium w-16 sm:w-18 text-center text-foreground">
                        {item.quantity} {item.quantity === 1 ? 'gramo' : 'gramos'}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="w-7 h-7 sm:w-8 sm:h-8 bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-7 h-7 sm:w-8 sm:h-8 text-destructive hover:text-destructive-foreground"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Separator className="bg-border" />
                <div className="flex justify-between items-center font-bold text-xl text-foreground">
                  <span>Total:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">${cartTotal}</span>
                </div>

                {/* Fecha y Hora */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Fecha de Reserva</label>
                      <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP", { locale: es }) : "Selecciona una fecha"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-background border-border" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateSelect}
                            initialFocus
                            className="rounded-md border-border"
                            disabled={disabledDays}
                            fromDate={new Date()}
                            toDate={new Date(new Date().setMonth(new Date().getMonth() + 1))}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Hora de Reserva</label>
                      <Popover open={isTimeOpen} onOpenChange={setIsTimeOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground",
                              !time && "text-muted-foreground"
                            )}
                            disabled={!date}
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            {time || "Selecciona una hora"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-background border-border" align="start">
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 p-2">
                            {availableTimes.length > 0 ? (
                              availableTimes.map((timeSlot) => (
                                <Button
                                  key={timeSlot}
                                  variant="ghost"
                                  className={cn(
                                    "h-7 sm:h-8 w-14 sm:w-16 text-xs sm:text-sm text-foreground hover:bg-accent hover:text-accent-foreground",
                                    time === timeSlot && "bg-emerald-500 hover:bg-emerald-600 text-white"
                                  )}
                                  onClick={() => handleTimeSelect(timeSlot)}
                                >
                                  {timeSlot}
                                </Button>
                              ))
                            ) : (
                              <div className="col-span-full text-center text-sm text-muted-foreground py-2">
                                No hay horarios disponibles
                              </div>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Comentario */}
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Comentario (opcional)</label>
                    <Textarea 
                      placeholder="Agrega algún comentario o instrucción especial..."
                      className="bg-background text-foreground border-border placeholder:text-muted-foreground min-h-[80px] sm:min-h-[100px]"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-4 sm:py-6 text-base sm:text-lg font-semibold shadow-xl hover:shadow-emerald-500/25 transition-all duration-300"
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