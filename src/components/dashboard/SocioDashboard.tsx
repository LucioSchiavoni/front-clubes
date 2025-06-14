import { useState, useRef } from "react"
import {
  ShoppingCart,
  User,
  Search,
  Filter,
  Heart,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Minus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useClub } from "@/hooks/useClub"
import { useProducts } from "@/hooks/useProducts"
import { useAuthStore } from "@/store/auth"
import { useOrdersBySocio } from "@/hooks/useOrders"
import ShoppingCartComponent from '@/components/cart/ShoppingCart'
import { FeaturedProductCard } from "@/components/products/FeaturedProductCard"
import OrderSocios from "../orders/OrderSocios"
import { Order } from "@/types/order"
import { ThemeSwitch } from "../theme-switch"

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

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product, quantity: number) => void
  onToggleFavorite: (id: string) => void
  isFavorite: boolean
}

export default function Component() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [favorites, setFavorites] = useState<string[]>([])
  const carouselRef = useRef<HTMLDivElement>(null)
  const { profile } = useAuthStore()
  const { products, isLoading } = useProducts(profile?.data?.clubId)
  const { club } = useClub()


  const addToCart = (product: Product, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        )
      }
      return [...prev, { ...product, quantity }]
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
      selectedCategory === "all" || product.category === selectedCategory
    
    
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
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
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
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeSwitch/>

              <ShoppingCartComponent
                cart={cart}
                cartItemsCount={cartItemsCount}
                cartTotal={cartTotal}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeFromCart}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Products */}
          <div className="flex-1">
            {/* Filters */}
            <div className="flex flex-col gap-4 mb-12">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-base bg-background border-border text-foreground placeholder:text-muted-foreground shadow-sm"
                />
              </div>

              <div className="flex items-center justify-end">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-40 h-12 bg-background border-border text-foreground shadow-sm">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="sativa">Sativa</SelectItem>
                    <SelectItem value="indica">Indica</SelectItem>
                    <SelectItem value="hibrida">Híbrida</SelectItem>
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
              </div>

              <div className="w-full">
                {featuredProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 bg-card/50 rounded-xl border border-border/50">
                    <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-foreground">No encontramos productos</h3>
                      <p className="text-muted-foreground max-w-sm">
                        No hay productos que coincidan con tu búsqueda "{searchTerm}". 
                        Intenta con otros términos o revisa los filtros aplicados.
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedCategory("all")
                      }}
                      className="mt-2"
                    >
                      Limpiar búsqueda
                    </Button>
                  </div>
                ) : (
                  <FeaturedProductCard
                    products={featuredProducts}
                    onAddToCart={addToCart}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={favorites.includes(featuredProducts[0]?.id)}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Orders */}
          <div className="w-full lg:w-96">
            <div className="lg:sticky lg:top-24">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text text-transparent mb-6">
                📦 Mis Pedidos
              </h2>
              <div className="lg:h-[calc(100vh-12rem)] lg:overflow-y-auto lg:pr-4">
                <OrderSocios />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

