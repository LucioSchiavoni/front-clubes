import { useState } from 'react'
import { Search, Filter, MoreHorizontal, Edit, Trash2, Eye, PackagePlus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'
import type { Product } from '@/hooks/useProducts'
import ProductItem from './ProductItem'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ProductListProps {
  products: Product[]
  isLoading: boolean
  error: string | null
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
  onUpdateStock: (id: string, stock: number) => void
  onAddProduct: () => void
}

export const ProductList = ({ 
  products, 
  isLoading, 
  error,
  onEdit,
  onDelete,
  onUpdateStock,
  onAddProduct
}: ProductListProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-lg">
        Error: {error}
      </div>
    )
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = 
      selectedCategory === "all" || product.category === selectedCategory
    
    
    return matchesSearch && matchesCategory
  })

  return (
    <>
      <Card className="border-green-200 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
          <CardTitle className="text-green-800 flex items-center">
            <PackagePlus className="h-5 w-5 mr-2" />
            Catálogo de Productos
          </CardTitle>
          <CardDescription className="text-green-600">
            Gestiona los productos de tu club cannábico
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-[300px] border-green-200 focus:border-green-500 rounded-xl"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40 border-green-200 text-green-700 hover:bg-green-50 rounded-xl">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white text-green-800 border-green-200">
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="sativa">Sativa</SelectItem>
                  <SelectItem value="indica">Indica</SelectItem>
                  <SelectItem value="hibrida">Híbrida</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={onAddProduct}
              className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
            >
              <PackagePlus className="h-4 w-4 mr-2" />
              Agregar Producto
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="border-green-200 hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      {product.image ? (
                        <img 
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 rounded-lg object-cover cursor-pointer"
                          onClick={() => setSelectedProduct(product)}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-green-100 flex items-center justify-center">
                          <PackagePlus className="h-8 w-8 text-green-600" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg text-green-800">{product.name}</h3>
                        <Badge className="mt-1 bg-green-100 text-green-800 border-green-200 capitalize">
                          {product.category}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-green-100">
                          <MoreHorizontal className="h-4 w-4 text-green-600" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="border-green-200 rounded-xl">
                        <DropdownMenuLabel className="text-green-800">Acciones</DropdownMenuLabel>
                        <DropdownMenuItem 
                          className="hover:bg-green-50"
                          onClick={() => onEdit(product)}
                        >
                          <Edit className="mr-2 h-4 w-4 text-green-600" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="hover:bg-green-50"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <Eye className="mr-2 h-4 w-4 text-green-600" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => onDelete(product.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">THC:</span>
                      <span className="font-medium text-green-800">{product.thc}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">CBD:</span>
                      <span className="font-medium text-green-800">{product.CBD}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Precio:</span>
                      <span className="font-medium text-green-800">€{product.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Stock:</span>
                      <span className="font-medium text-green-800">{product.stock}g</span>
                    </div>
                    {product.club && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">Club:</span>
                        <span className="font-medium text-green-800">{product.club.name}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de detalles del producto */}
       {selectedProduct && (
        <ProductItem
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  )
} 