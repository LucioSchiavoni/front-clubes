import instance from '@/config/axios'
import type { Product } from '@/hooks/useProducts'

interface ApiResponse<T> {
  success: boolean
  statusCode: number
  message: string
  data: T
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

export const productApi = {
  // Obtener todos los productos
  getAllProducts: async (id:string): Promise<ApiResponse<Product[]>> => {
    const response = await instance.get(`/products/${id}`)
    return response.data
  },

  // Obtener un producto por ID
  getProductById: async (id: string): Promise<ApiResponse<Product>> => {
    const response = await instance.get(`/product/${id}`)
    return response.data
  },

  // Crear un nuevo producto
  createProduct: async (productData: CreateProductData): Promise<ApiResponse<Product>> => {
    const formData = new FormData()
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'image' && value instanceof File) {
          formData.append(key, value)
        } else {
          formData.append(key, value.toString())
        }
      }
    })

    const response = await instance.post('/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  // Actualizar un producto existente
  updateProduct: async (productData: UpdateProductData): Promise<ApiResponse<Product>> => {
    const formData = new FormData()
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id') {
        formData.append(key, value.toString())
      }
    })

    const response = await instance.put(`/${productData.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  // Eliminar un producto
  deleteProduct: async (id: string): Promise<ApiResponse<void>> => {
    const response = await instance.delete(`/${id}`)
    return response.data
  },

  // Actualizar el stock de un producto
  updateStock: async (id: string, stock: number): Promise<ApiResponse<Product>> => {
    const response = await instance.patch(`/${id}/stock`, 
      { stock },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    return response.data
  }
}
