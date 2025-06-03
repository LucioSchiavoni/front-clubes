import instance from '@/config/axios'
import type { CartItem } from '@/types/cart'

export interface ReservationData {
  items: CartItem[]
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