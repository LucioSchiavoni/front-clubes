import { ShoppingCart, Clock, Heart, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface Product {
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

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product, quantity: number) => void
  onToggleFavorite: (id: string) => void
  isFavorite: boolean
}

export function FeaturedProductCard({ product, onAddToCart, onToggleFavorite, isFavorite }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= product.stock) {
      setQuantity(value)
    }
  }

  const handleAddToCart = () => {
    onAddToCart(product, quantity)
    setQuantity(1) // Resetear la cantidad después de agregar al carrito
  }

  return (
    <Card className="group relative overflow-hidden transition-all duration-700 hover:-translate-y-4 hover:scale-105">
      {/* Animated Border */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-emerald-500/20 group-hover:from-emerald-500/50 group-hover:via-green-500/50 group-hover:to-emerald-500/50 transition-all duration-500 blur-sm"></div>

      <CardContent className="p-0 relative z-10">
        {/* Image */}
        <div className="relative h-80 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-2"
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Category & Stock */}
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="border-emerald-400/50 text-emerald-400 bg-emerald-500/10 backdrop-blur-xl capitalize"
            >
              {product.category}
            </Badge>
            <div className="flex items-center space-x-1 text-sm text-gray-300">
              <Clock className="w-4 h-4" />
              <span>{product.stock} disponibles</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-gray-300 text-sm line-clamp-2">{product.description}</p>

          {/* THC/CBD Info */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="font-medium text-emerald-400">THC:</span>
              <span className="text-white font-bold">{product.thc}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="font-medium text-purple-400">CBD:</span>
              <span className="text-white font-bold">{product.CBD}%</span>
            </div>
          </div>

          {/* Price & Action */}
          <div className="flex flex-col space-y-4 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                ${product.price}
                <span className="text-sm text-gray-400 font-normal">/g</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-xl rounded-lg px-2 py-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-white font-medium min-w-[2rem] text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {product.stock === 0 ? "Agotado" : `Agregar ${quantity}g`}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 