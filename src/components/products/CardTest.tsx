"use client"

import React from "react"
import { ShoppingCart, Minus, Plus, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

export function CardTest({ products, onAddToCart, onToggleFavorite, isFavorite }: ProductCardProps) {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [quantity, setQuantity] = React.useState(1)
  const [isEditing, setIsEditing] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

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

  const formatPrice = (price: number) => `$${price.toFixed(2)}`
  const formatStock = (stock: number) => (stock >= 1000 ? `${(stock / 1000).toFixed(1)}K` : stock.toString())

  if (!products.length) return null

  const currentProduct = products[currentSlide]

  return (
    <div className="flex justify-center items-center w-full p-4">
      <div className="bg-white dark:bg-gray-900 max-w-[650px] w-full rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">
        <div className="p-6">
          {/* Header con badges y favorito */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-2">
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 font-medium border border-emerald-200 dark:border-emerald-800"
              >
                {currentProduct.category}
              </Badge>
              <Badge
                variant={
                  currentProduct.stock > 50 ? "default" : currentProduct.stock > 10 ? "secondary" : "destructive"
                }
                className={`font-medium border ${
                  currentProduct.stock > 50
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800"
                    : currentProduct.stock > 10
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800"
                }`}
              >
                Stock: {formatStock(currentProduct.stock)}g
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
             onClick={() => onToggleFavorite(currentProduct.id)} 
            >
              <Heart
                fill={isFavorite ? "currentColor" : "none"}
                color={isFavorite ? "#ef4444" : "currentColor"}
                strokeWidth={1.5}
                width={24}
                height={24}
                className="transition-colors duration-200"
              />
            </Button>
          </div>

          {/* Contenido principal */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Imagen */}
            <div className="md:col-span-2">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <img
                  alt={currentProduct.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  src={currentProduct.image || "/placeholder.svg?height=300&width=300"}
                />
                {currentProduct.stock === 0 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Badge variant="destructive" className="text-lg font-bold dark:bg-red-900/80 dark:text-red-200">
                      AGOTADO
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Información del producto */}
            <div className="md:col-span-3 flex flex-col justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{currentProduct.name}</h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                  {currentProduct.description}
                </p>

                {/* Precio destacado */}
                <div className="mb-6">
                  <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {formatPrice(currentProduct.price)}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">/g</span>
                </div>
              </div>

              {/* Controles de cantidad */}
              <div className="space-y-4">
                {/* Botones rápidos */}
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 20, 40].map((value) => (
                    <Button
                      key={value}
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs font-medium border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-900/20 bg-transparent transition-colors"
                      onClick={() => handleQuantityChange(value)}
                      disabled={value > currentProduct.stock}
                    >
                      +{value}g
                    </Button>
                  ))}
                </div>

                {/* Selector de cantidad */}
                <div className="flex items-center justify-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg border-gray-300 dark:border-gray-600 bg-transparent"
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
                      className="h-8 w-16 text-center text-base border-gray-300 dark:border-gray-600 focus-visible:ring-emerald-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      min={1}
                      max={currentProduct.stock}
                      autoFocus
                    />
                  ) : (
                    <span
                      className="text-lg font-bold min-w-[3rem] text-center cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors px-3 py-1 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                      onClick={handleQuantityClick}
                    >
                      {quantity}g
                    </span>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg border-gray-300 dark:border-gray-600 bg-transparent"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= currentProduct.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Botón agregar al carrito */}
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-base disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-700"
                  disabled={currentProduct.stock === 0}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {currentProduct.stock === 0 ? "PRODUCTO AGOTADO" : `AGREGAR ${quantity}G AL CARRITO`}
                </Button>
              </div>
            </div>
          </div>

          {/* Navegación de slides */}
          {products.length > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-gray-300 dark:border-gray-600 hover:bg-emerald-50 hover:border-emerald-300 dark:hover:bg-emerald-900/20 bg-transparent"
                onClick={prevSlide}
              >
                <ChevronLeft width={20} height={20} />
              </Button>

              <div className="flex gap-2">
                {products.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 w-8 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "bg-emerald-600 shadow-lg dark:bg-emerald-400"
                        : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                    }`}
                    onClick={() => {
                      setCurrentSlide(index)
                      setQuantity(1)
                    }}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-gray-300 dark:border-gray-600 hover:bg-emerald-50 hover:border-emerald-300 dark:hover:bg-emerald-900/20 bg-transparent"
                onClick={nextSlide}
              >
                <ChevronRight width={20} height={20} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
