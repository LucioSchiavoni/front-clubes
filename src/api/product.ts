import instance from '@/config/axios'
import type { Product } from '@/hooks/useProducts'

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
  getAllProducts: async (): Promise<Product[]> => {
    const response = await instance.get('/')
    return response.data
  },

  // Obtener un producto por ID
  getProductById: async (id: string): Promise<Product> => {
    const response = await instance.get(`/${id}`)
    return response.data
  },

  // Crear un nuevo producto
  createProduct: async (productData: CreateProductData): Promise<Product> => {
    const formData = new FormData()
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString())
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
  updateProduct: async (productData: UpdateProductData): Promise<Product> => {
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
  deleteProduct: async (id: string): Promise<void> => {
    await instance.delete(`/${id}`)
  },

  // Actualizar el stock de un producto
  updateStock: async (id: string, stock: number): Promise<Product> => {
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
