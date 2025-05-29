import { useState, useCallback } from 'react'
import { productApi } from '@/api/product'

export interface Product {
  id: string
  name: string
  description: string
  image: string
  price: number
  category: string
  thc: number
  CBD: number
  stock: number
  active: boolean
  createdAt: string
  updatedAt: string
  clubId: string
}

interface CreateProductData {
  name: string
  description: string
  price: number
  category: string
  thc: number
  CBD: number
  stock: number
  image?: File
}

interface UpdateProductData extends Partial<CreateProductData> {
  id: string
}

export const useProducts = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])

  const getAllProducts = useCallback(async (): Promise<Product[]> => {
    try {
      setIsLoading(true)
      const data = await productApi.getAllProducts()
      setProducts(Array.isArray(data) ? data : [])
      return Array.isArray(data) ? data : []
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getProductById = async (id: string): Promise<Product | null> => {
    try {
      setIsLoading(true)
      return await productApi.getProductById(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const createProduct = async (productData: Parameters<typeof productApi.createProduct>[0]): Promise<Product | null> => {
    try {
      setIsLoading(true)
      const newProduct = await productApi.createProduct(productData)
      if (newProduct) {
        setProducts(currentProducts => {
          const productsArray = Array.isArray(currentProducts) ? currentProducts : []
          return [...productsArray, newProduct]
        })
      }
      return newProduct
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const updateProduct = async (productData: Parameters<typeof productApi.updateProduct>[0]): Promise<Product | null> => {
    try {
      setIsLoading(true)
      const updatedProduct = await productApi.updateProduct(productData)
      if (updatedProduct) {
        setProducts(currentProducts => {
          const productsArray = Array.isArray(currentProducts) ? currentProducts : []
          return productsArray.map(p => p.id === updatedProduct.id ? updatedProduct : p)
        })
      }
      return updatedProduct
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      await productApi.deleteProduct(id)
      setProducts(currentProducts => {
        const productsArray = Array.isArray(currentProducts) ? currentProducts : []
        return productsArray.filter(p => p.id !== id)
      })
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const updateStock = async (id: string, stock: number): Promise<Product | null> => {
    try {
      setIsLoading(true)
      const updatedProduct = await productApi.updateStock(id, stock)
      if (updatedProduct) {
        setProducts(currentProducts => {
          const productsArray = Array.isArray(currentProducts) ? currentProducts : []
          return productsArray.map(p => p.id === updatedProduct.id ? updatedProduct : p)
        })
      }
      return updatedProduct
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    products,
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock
  }
} 