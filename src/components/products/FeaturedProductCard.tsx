import { ShoppingCart, Clock, Heart, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Input } from "@/components/ui/input"

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
  products: Product[]
  onAddToCart: (product: Product, quantity: number) => void
  onToggleFavorite: (id: string) => void
  isFavorite: boolean
}

export function FeaturedProductCard({ products, onAddToCart, onToggleFavorite, isFavorite }: ProductCardProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState("")

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length)
  }

  const handleQuantityChange = (value: number) => {
    const currentProduct = products[currentSlide]
    if (value >= 1 && value <= currentProduct.stock) {
      setQuantity(value)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    
    const numValue = parseInt(value)
    if (!isNaN(numValue) && numValue >= 1 && numValue <= products[currentSlide].stock) {
      setQuantity(numValue)
    }
  }

  const handleInputBlur = () => {
    setIsEditing(false)
    setInputValue("")
  }

  const handleQuantityClick = () => {
    setIsEditing(true)
    setInputValue(quantity.toString())
  }

  const handleAddToCart = () => {
    const currentProduct = products[currentSlide]
    onAddToCart(currentProduct, quantity)
    setQuantity(1)
  }

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`
  }

  const formatStock = (stock: number) => {
    if (stock >= 1000) {
      return `${(stock / 1000).toFixed(1)}K`
    }
    return stock.toString()
  }

  if (!products.length) return null

  const currentProduct = products[currentSlide]

  return (
    <div className="relative w-full h-96 rounded-2xl overflow-hidden bg-gray-900 group">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentProduct.image || "/placeholder.svg?height=400&width=800"}
          alt={currentProduct.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
      </div>

      {/* Navigation Arrows */}
      {products.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white border-0"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white border-0"
            onClick={nextSlide}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between z-10 p-4 md:p-6">
        {/* Top Content - Title and Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          {/* Product Title */}
          <div className="md:mb-4">
            <h2 className="text-2xl md:text-4xl font-black text-white mb-1 tracking-wide">{currentProduct.name}</h2>
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium text-xs md:text-sm">{currentProduct.description}</span>
              <Badge
                variant="outline"
                className="border-emerald-400/50 text-emerald-400 bg-emerald-500/10 backdrop-blur-xl capitalize text-xs"
              >
                {currentProduct.category}
              </Badge>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="backdrop-blur-md rounded-lg p-3 md:p-4 max-w-[200px] md:max-w-xs">
            <div className="grid grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm">
              <div>
                <div className="text-gray-400 font-medium">PRECIO</div>
                <div className="text-white font-bold">{formatPrice(currentProduct.price)}</div>
              </div>
              <div>
                <div className="text-gray-400 font-medium">STOCK</div>
                <div className="text-white font-bold">{formatStock(currentProduct.stock)} g</div>
              </div>
              <div>
                <div className="text-gray-400 font-medium">THC</div>
                <div className="text-emerald-400 font-bold">{currentProduct.thc}%</div>
              </div>
              <div>
                <div className="text-gray-400 font-medium">CBD</div>
                <div className="text-purple-400 font-bold">{currentProduct.CBD}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Content - Cart Controls */}
        <div className="flex flex-col gap-3">
          {/* Total Price */}
          <div className="flex items-center justify-end gap-2">
            <span className="text-gray-400 text-sm">Total:</span>
            <span className="text-emerald-400 font-bold text-lg">{formatPrice(currentProduct.price * quantity)}</span>
          </div>

          {/* Cart Controls */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Quantity Selector */}
            <div className="flex flex-col gap-2 bg-black/80 backdrop-blur-xl rounded-lg p-2 w-full md:w-auto">
              {/* Quick Increment Buttons */}
              <div className="flex items-center justify-center gap-1">
                {[5, 10, 20, 40].map((value) => (
                  <Button
                    key={value}
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-white hover:bg-white/20 border-0"
                    onClick={() => handleQuantityChange(value)}
                    disabled={value > currentProduct.stock}
                  >
                    +{value}g
                  </Button>
                ))}
              </div>
              
              {/* Manual Control */}
              <div className="flex items-center justify-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-white hover:bg-white/20 border-0"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                {isEditing ? (
                  <Input
                    type="number"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className="h-6 w-12 text-center text-base bg-transparent border-0 text-white p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    min={1}
                    max={products[currentSlide].stock}
                    autoFocus
                  />
                ) : (
                  <span 
                    className="text-white font-bold min-w-[1.5rem] text-center text-base cursor-pointer" 
                    onClick={handleQuantityClick}
                  >
                    {quantity}
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-white hover:bg-white/20 border-0"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= currentProduct.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold px-6 py-2 shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105 border-0"
              disabled={currentProduct.stock === 0}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {currentProduct.stock === 0 ? "AGOTADO" : `AGREGAR ${quantity}G`}
            </Button>
          </div>
        </div>
      </div>

      {/* Carousel Indicators */}
      {products.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? "bg-white" : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
} 