import instance from '@/config/axios'
import type { CartItem } from '@/types/cart'

export interface ReservationData {
  items: CartItem[]
  userId: string
  date: Date
  time: string
  comment?: string
  total: number
}

export const createOrder = async (data: ReservationData) => {
  try {
    const res = await instance.post("/order", data)
    return res.data
  } catch (error) {
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