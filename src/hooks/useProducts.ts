import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productApi } from '@/api/product'

export interface Product {
  id: string
  name: string
  description: string
  image: string | null
  price: number
  category: string
  thc: number
  CBD: number
  stock: number
  active: boolean
  createdAt: string
  updatedAt: string
  clubId: string | null
  club?: {
    id: string
    name: string
  } | null
}

// interface UpdateProductData extends Partial<CreateProductData> {
//   id: string
// }

export const useProducts = (clubId?: string) => {
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  // Query para obtener todos los productos
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', clubId],
    queryFn: async () => {
      if (!clubId) return []
      try {
        const response = await productApi.getAllProducts(clubId)
        return Array.isArray(response.data) ? response.data : []
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        return []
      }
    },
    enabled: !!clubId
  })

  // Query para obtener un producto específico
  const getProductById = useCallback(async (id: string): Promise<Product | null> => {
    try {
      const response = await productApi.getProductById(id)
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      return null
    }
  }, [])

  // Mutación para crear un producto
  const createProductMutation = useMutation({
    mutationFn: (productData: Parameters<typeof productApi.createProduct>[0]) => 
      productApi.createProduct(productData),
    onSuccess: (response) => {
      queryClient.setQueryData(['products', clubId], (oldData: Product[] = []) => {
        return [...oldData, response.data]
      })
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    }
  })

  // Mutación para actualizar un producto
  const updateProductMutation = useMutation({
    mutationFn: (productData: Parameters<typeof productApi.updateProduct>[0]) => 
      productApi.updateProduct(productData),
    onSuccess: (response) => {
      queryClient.setQueryData(['products', clubId], (oldData: Product[] = []) => {
        return oldData.map(p => p.id === response.data.id ? response.data : p)
      })
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    }
  })

  // Mutación para eliminar un producto
  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => productApi.deleteProduct(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(['products', clubId], (oldData: Product[] = []) => {
        return oldData.filter(p => p.id !== id)
      })
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    }
  })

  // Mutación para actualizar el stock
  const updateStockMutation = useMutation({
    mutationFn: ({ id, stock }: { id: string; stock: number }) => 
      productApi.updateStock(id, stock),
    onSuccess: (response) => {
      queryClient.setQueryData(['products', clubId], (oldData: Product[] = []) => {
        return oldData.map(p => p.id === response.data.id ? response.data : p)
      })
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    }
  })

  return {
    isLoading,
    error,
    products,
    getProductById,
    createProduct: createProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
    updateStock: (id: string, stock: number) => updateStockMutation.mutate({ id, stock })
  }
} 