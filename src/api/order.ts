import instance from '@/config/axios'
import type { CartItem } from '@/types/cart'

export interface ReservationData {
  items: CartItem[]
  userId: string
  date: Date
  time: string
  comment?: string
  total: number // Total de precio en euros (no gramos)
}

export interface CreateOrderResponse {
  success: boolean
  message: string
  data: any // Tipo de la orden creada
  gramInfo: {
    gramsReserved: number
    availableAfterOrder: number
    monthlyLimit: number
  }
}

export interface LimitExceededError {
  success: false
  message: string
  details: {
    monthlyLimit: number
    currentUsed: number
    availableGrams: number
    requestedGrams: number
  }
}

export const createOrder = async (data: ReservationData): Promise<CreateOrderResponse> => {
  try {
    const res = await instance.post("/order", data)
    return res.data
  } catch (error: any) {
    // Manejar error específico de límite excedido
    if (error.response?.status === 400 && error.response?.data?.success === false) {
      const errorData: LimitExceededError = error.response.data
      const errorMessage = errorData.message || 'Error de validación de límites'
      
      // Crear un error personalizado con información adicional
      const customError = new Error(errorMessage) as any
      customError.isLimitExceeded = true
      customError.limitDetails = errorData.details
      
      throw customError
    }

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    
    // Error genérico
    throw new Error('Error al crear la reserva')
  }
}

export const getOrderByUserId = async(userId: string) => {
  try {
    const res = await instance.get(`/order/club/${userId}`)
    return res.data
  } catch (error) {
    throw new Error('Error al obtener las reservas del usuario')
  }
}

export const getOrderBySocioId = async(socioId: string) => {
  try {
    const res = await instance.get(`/order/socio/${socioId}`)
    return res.data
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw new Error('Error al obtener las reservas del socio')
  }
}

export const getGramsBySocio = async(userId: string) => {
    try {
      const res = await instance.get(`/user/${userId}/monthly-stats`)
      return res.data
    } catch (error) {
      throw new Error('Error al obtener las estadísticas mensuales del socio')
    }
}


export const putCompleteOrder = async(orderId: string) => {
  try {
    const res = await instance.put(`/order/${orderId}/complete`)
    return res.data
  } catch (error) {
    throw new Error('Error al cambiar el status de la orden')
  }
}

export const cancelOrder = async(id: string) => {
  try {
    const res = await instance.put(`/order/${id}/cancel`)
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al cancelar la orden')
  }
}