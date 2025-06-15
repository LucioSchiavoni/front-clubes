import { ShoppingCart, Minus, Plus, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

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
    setQuantity(1)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length)
    setQuantity(1)
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

    const numValue = Number.parseInt(value)
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
    <div className="relative w-full">
      <div className="relative w-full h-[500px] sm:h-[400px] rounded-2xl overflow-hidden bg-black">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={currentProduct.image || "/placeholder.svg?height=400&width=1200"}
            alt={currentProduct.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40"></div>
          {/* View Full Image Button */}
          {currentProduct.image && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-30 bg-black/60 hover:bg-black/80 text-white border-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full"
                >
                  <Maximize2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[90vw] sm:max-w-[800px] max-h-[90vh] p-0 bg-transparent border-0">
                <img
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  className="w-full h-full object-contain rounded-lg shadow-2xl"
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Navigation Arrows */}
        {products.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 sm:left-6 top-1/2 transform -translate-y-1/2 z-30 bg-black/60 hover:bg-black/80 text-white border-0 h-8 w-8 sm:h-12 sm:w-12 rounded-full"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 sm:right-6 top-1/2 transform -translate-y-1/2 z-30 bg-black/60 hover:bg-black/80 text-white border-0 h-8 w-8 sm:h-12 sm:w-12 rounded-full"
              onClick={nextSlide}
            >
              <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
            </Button>
          </>
        )}

        {/* Main Content */}
        <div className="absolute inset-0 flex flex-col sm:flex-row items-end justify-between p-4 sm:p-8 z-20">
          {/* Left Content - Title and Stats */}
          <div className="flex flex-col w-full sm:max-w-2xl mb-4 sm:mb-0">
            {/* Product Title with Category Badge */}
            <div className="mb-4">
              {/* Price Display - Moved to top */}
              <div className="mb-3">
                <div className="text-emerald-400 font-bold text-2xl sm:text-3xl">{formatPrice(currentProduct.price)}</div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <h1 className="text-2xl sm:text-4xl font-bold text-white">{currentProduct.name}</h1>
                <Badge
                  variant="outline"
                  className="border-emerald-400/50 text-emerald-400 bg-emerald-500/10 backdrop-blur-xl capitalize w-fit"
                >
                  {currentProduct.category}
                </Badge>
              </div>
              <p className="text-gray-300 text-sm sm:text-lg leading-relaxed">{currentProduct.description}</p>
            </div>

            {/* Stats Table */}
            <div className="bg-black/60 backdrop-blur-sm rounded-xl border border-gray-700/30 overflow-x-auto">
              <div className="grid grid-cols-3 divide-x divide-gray-700/30 min-w-[280px]">
                <div className="px-5 py-4 text-center">
                  <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">STOCK</div>
                  <div className="text-white text-base sm:text-lg font-bold">{formatStock(currentProduct.stock)} g</div>
                </div>
                <div className="px-5 py-4 text-center">
                  <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">THC</div>
                  <div className="text-emerald-400 text-base sm:text-lg font-bold">{currentProduct.thc}%</div>
                </div>
                <div className="px-5 py-4 text-center">
                  <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">CBD</div>
                  <div className="text-purple-400 text-base sm:text-lg font-bold">{currentProduct.CBD}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Cart Controls */}
          <div className="flex flex-col space-y-3 l sm:min-w-[200px]">
            {/* Quantity Control Card */}
            <div className=" backdrop-blur-sm rounded-lg border border-gray-700/20 p-3">
              <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 text-center">CANTIDAD</div>

              {/* Quick Increment Buttons */}
              <div className="grid grid-cols-4 text-xl sm:grid-cols-2 gap-1 mb-2">
                {[5, 10, 20, 40].map((value) => (
                  <Button
                    key={value}
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1 text-xs text-white/80 hover:bg-white/10 border-0"
                    onClick={() => handleQuantityChange(value)}
                    disabled={value > currentProduct.stock}
                  >
                    +{value}g
                  </Button>
                ))}
              </div>

              {/* Manual Control */}
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-white/80 hover:bg-white/10 border border-gray-600/30 rounded"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                {isEditing ? (
                  <Input
                    type="number"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className="h-6 w-12 text-center text-xs bg-black/30 border border-gray-600/30 text-white/90 focus-visible:ring-1 focus-visible:ring-emerald-500"
                    min={1}
                    max={products[currentSlide].stock}
                    autoFocus
                  />
                ) : (
                  <span
                    className="text-white/90 font-bold min-w-[1.5rem] text-center text-sm cursor-pointer hover:text-emerald-400 transition-colors px-1 py-0.5 border border-gray-600/30 rounded bg-black/20"
                    onClick={handleQuantityClick}
                  >
                    {quantity}
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-white/80 hover:bg-white/10 border border-gray-600/30 rounded"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= currentProduct.stock}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              {/* Total Price */}
              <div className="text-center mb-2 pb-2 border-b border-gray-700/20">
                <div className="text-gray-400 text-xs">Total</div>
                <div className="text-emerald-400 font-bold text-base">{formatPrice(currentProduct.price * quantity)}</div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                className="w-full bg-white/90 hover:bg-white text-black font-semibold py-1.5 px-3 rounded-lg transition-all duration-200 border-0 shadow-lg text-xs"
                disabled={currentProduct.stock === 0}
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                {currentProduct.stock === 0 ? "AGOTADO" : `AGREGAR ${quantity}G`}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Indicators */}
      {products.length > 1 && (
        <div className="flex justify-center items-center gap-3 mt-4">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 sm:h-4 rounded-full transition-all ${
                index === currentSlide ? "bg-white w-12 sm:w-16" : "bg-white/40 hover:bg-white/60 w-3 sm:w-4"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
} 