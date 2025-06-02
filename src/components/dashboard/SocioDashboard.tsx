"use client"

import { useState, useRef, useEffect } from "react"
import {
  Calendar,
  ShoppingCart,
  User,
  Search,
  Filter,
  Heart,
  Star,
  Clock,
  Plus,
  Minus,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react"


import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useClub } from "@/hooks/useClub"
import { useProducts } from "@/hooks/useProducts"
import { useAuthStore } from "@/store/auth"

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

interface CartItem extends Product {
  quantity: number
}

export default function Component() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [favorites, setFavorites] = useState<string[]>([])
  const carouselRef = useRef<HTMLDivElement>(null)
  const { profile } = useAuthStore()
  const { products, isLoading } = useProducts(profile?.data?.clubId)
  const { club } = useClub()
  const { logout } = useAuthStore()

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId)
      return
    }
    setCart((prev) => prev.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)))
  }

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const scrollCarousel = (direction: string) => {
    if (carouselRef.current) {
      const scrollAmount = 400
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" || product.category.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const featuredProducts = filteredProducts.filter((p) => p.active)
  const allProducts = filteredProducts

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen ">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-black/20 border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <span className="text-white font-bold text-xl">🌿</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-600 rounded-2xl blur opacity-50 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text text-transparent">
                  {club?.name || "Club"}
                </h1>
                <p className="text-sm text-gray-400">Cannabis Marketplace</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {profile && (
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20">
                  <User className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-medium text-white">{profile.name || "Usuario"}</span>
                </div>
              )}

              <Button
                variant="outline"
                size="icon"
                className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 text-white"
                onClick={logout}
              >
                <LogOut className="w-5 h-5" />
              </Button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 text-white"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartItemsCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs animate-bounce">
                        {cartItemsCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-96 bg-slate-900/95 backdrop-blur-xl border-white/10">
                  <SheetHeader>
                    <SheetTitle className="flex items-center space-x-2 text-white">
                      <ShoppingCart className="w-5 h-5" />
                      <span>Carrito de Reservas</span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {cart.length === 0 ? (
                      <p className="text-center text-gray-400 py-8">Tu carrito está vacío</p>
                    ) : (
                      <>
                        {cart.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center space-x-3 p-3 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10"
                          >
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-[50px] h-[50px] rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm text-white">{item.name}</h4>
                              <p className="text-emerald-400 font-bold">${item.price}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="w-6 h-6 bg-white/10 border-white/20 text-white"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="text-sm font-medium w-6 text-center text-white">{item.quantity}</span>
                              <Button
                                size="icon"
                                variant="outline"
                                className="w-6 h-6 bg-white/10 border-white/20 text-white"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="w-6 h-6 text-red-400 hover:text-red-300"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Separator className="bg-white/10" />
                        <div className="flex justify-between items-center font-bold text-lg text-white">
                          <span>Total:</span>
                          <span className="text-emerald-400">${cartTotal}</span>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-2xl">
                              <Calendar className="w-4 h-4 mr-2" />
                              Reservar Fecha de Retiro
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md bg-slate-900/95 backdrop-blur-xl border-white/10 text-white">
                            <DialogHeader>
                              <DialogTitle className="text-white">Seleccionar Fecha y Hora de Retiro</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <CalendarComponent
                                mode="single"
                                selected={selectedDate || undefined}
                                onSelect={(date) => setSelectedDate(date || null)}
                                className="rounded-md border border-white/10 bg-white/5"
                              />
                              <Select value={selectedTime} onValueChange={setSelectedTime}>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                  <SelectValue placeholder="Seleccionar hora" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-white/10">
                                  <SelectItem value="10:00">10:00 AM</SelectItem>
                                  <SelectItem value="11:00">11:00 AM</SelectItem>
                                  <SelectItem value="12:00">12:00 PM</SelectItem>
                                  <SelectItem value="14:00">2:00 PM</SelectItem>
                                  <SelectItem value="15:00">3:00 PM</SelectItem>
                                  <SelectItem value="16:00">4:00 PM</SelectItem>
                                  <SelectItem value="17:00">5:00 PM</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                className="w-full bg-gradient-to-r from-emerald-500 to-green-600"
                                disabled={!selectedDate || !selectedTime}
                              >
                                Confirmar Reserva
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-white/10 backdrop-blur-xl border-white/20 text-white placeholder:text-gray-400 focus:border-emerald-400"
            />
          </div>

          <div className="flex items-center space-x-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40 bg-white/10 backdrop-blur-xl border-white/20 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900/95 backdrop-blur-xl border-white/10">
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="sativa">Sativa</SelectItem>
                <SelectItem value="indica">Indica</SelectItem>
                <SelectItem value="híbrida">Híbrida</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Featured Products Carousel */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text text-transparent">
              ✨ Productos Destacados
            </h2>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scrollCarousel("left")}
                className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scrollCarousel("right")}
                className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {featuredProducts.map((product) => (
              <div key={product.id} className="flex-none w-80">
                <FeaturedProductCard
                  product={product}
                  onAddToCart={addToCart}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={favorites.includes(product.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* All Products Grid */}
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-8">
            🌿 Todos los Productos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {allProducts.map((product) => (
              <ModernProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onToggleFavorite={toggleFavorite}
                isFavorite={favorites.includes(product.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onToggleFavorite: (id: string) => void
  isFavorite: boolean
}

function FeaturedProductCard({ product, onAddToCart, onToggleFavorite, isFavorite }: ProductCardProps) {
  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 shadow-2xl hover:shadow-emerald-500/25 transition-all duration-700 hover:-translate-y-4 hover:scale-105">
      {/* Animated Border */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-emerald-500/20 group-hover:from-emerald-500/50 group-hover:via-green-500/50 group-hover:to-emerald-500/50 transition-all duration-500 blur-sm"></div>

      {/* Favorite Button */}
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-4 right-4 z-20 bg-black/30 backdrop-blur-xl hover:bg-black/50 border border-white/20"
        onClick={() => onToggleFavorite(product.id)}
      >
        <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-white"}`} />
      </Button>

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
              className="border-emerald-400/50 text-emerald-400 bg-emerald-500/10 backdrop-blur-xl"
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
          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              ${product.price}
              <span className="text-sm text-gray-400 font-normal">/g</span>
            </div>
            <Button
              onClick={() => onAddToCart(product)}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {product.stock === 0 ? "Agotado" : "Agregar"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ModernProductCard({ product, onAddToCart, onToggleFavorite, isFavorite }: ProductCardProps) {
  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-purple-500/5 group-hover:from-emerald-500/10 group-hover:to-purple-500/10 transition-all duration-500"></div>

      {/* Favorite Button */}
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-3 right-3 z-10 bg-black/20 backdrop-blur-xl hover:bg-black/40"
        onClick={() => onToggleFavorite(product.id)}
      >
        <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-white"}`} />
      </Button>

      <CardContent className="p-0 relative z-10">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

          {/* Stock indicator */}
          <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-xl rounded-full px-2 py-1">
            <span className="text-xs text-white">{product.stock} disponibles</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Category */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="border-emerald-400/50 text-emerald-400 bg-emerald-500/10">
              {product.category}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-gray-300 text-xs line-clamp-2">{product.description}</p>

          {/* THC/CBD */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-emerald-400 font-medium">THC: {product.thc}%</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-purple-400 font-medium">CBD: {product.CBD}%</span>
            </div>
          </div>

          {/* Price & Action */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className="text-xl font-bold text-emerald-400">
              ${product.price}
              <span className="text-xs text-gray-400 font-normal">/g</span>
            </div>
            <Button
              onClick={() => onAddToCart(product)}
              size="sm"
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={product.stock === 0}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
