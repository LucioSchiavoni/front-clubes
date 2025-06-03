import type { Product } from '@/hooks/useProducts'

export interface CartItem extends Product {
  quantity: number
} 