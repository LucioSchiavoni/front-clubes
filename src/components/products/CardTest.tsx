import { ShoppingCart, Minus, Plus, ChevronLeft, ChevronRight, Maximize2, HeartIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card } from "../ui/card"

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

export function CardTest({ products, onAddToCart, onToggleFavorite, isFavorite }: ProductCardProps) {
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
   <div>
      <Card
      className="border bg-background/60 dark:bg-default-100/50 max-w-[610px]" 
    >
    
        <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
          <div className="relative col-span-6 md:col-span-4">
            <img
              alt="Album cover"
              className="object-cover rounded-md scale-105"
              height={200}
              
              src={currentProduct.image || "https://via.placeholder.com/200"}
              width="100%"
            />
          </div>

          <div className="flex flex-col gap-2">
          <h2 className="font-semibold text-large capitalize">Titulo</h2>
            <div className="flex justify-between  items-start">
             
              <div className="flex flex-col gap-0 mt-4">
                <h3 className="font-semibold text-foreground/90">{currentProduct.thc}</h3>
                <p className="text-small text-foreground/80">{currentProduct.category}</p>
                <h1 className="text-large font-medium mt-2">{currentProduct.name}</h1>
              </div>
             
            </div>

                  {/* Right Content - Cart Controls */}
          <div className="flex flex-col space-y-3 l m-auto">
            {/* Quantity Control Card */}
            <div className=" backdrop-blur-sm rounded-lg border border-gray-700/20 p-3">
              <div className="text-white text-xl font-medium uppercase tracking-wider mb-2 text-center ">CANTIDAD</div>

              {/* Quick Increment Buttons */}
              <div className="flex  text-xl sm:grid-cols-2 gap-3 mb-2">
                {[5, 10, 20, 40].map((value) => (
                  <Button
                    key={value}
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1 text-xs text-white/80 hover:bg-white/10 border pb-1 p-3 "
                    onClick={() => handleQuantityChange(value)}
                    disabled={value > currentProduct.stock}
                  >
                   <span className="text-lg">+{value}g</span> 
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
    </Card>
 




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