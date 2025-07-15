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
      <div>
        <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
          <div className="relative col-span-6 md:col-span-4">
            <img
              alt="Album cover"
              className="object-cover rounded-md scale-105"
              height={200}
              
              src="https://heroui.com/images/album-cover.png"
              width="100%"
            />
          </div>

          <div className="flex flex-col gap-2">
          <h2 className="font-semibold text-large capitalize">Titulo</h2>
            <div className="flex justify-between  items-start">
             
              <div className="flex flex-col gap-0 mt-4">
                <h3 className="font-semibold text-foreground/90"></h3>
                <p className="text-small text-foreground/80">{currentProduct.category}</p>
                <h1 className="text-large font-medium mt-2">{currentProduct.name}</h1>
              </div>
             
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