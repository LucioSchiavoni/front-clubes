import { CheckCircle2, Leaf, TrendingUp, Users, Package, Calendar } from "lucide-react"
import { Card } from "@/components/ui/card"

interface FeaturedSectionProps {
  clubName: string
  totalSocios: number
  totalProductos: number
  totalReservas: number
  totalActivos: number
  totalGramos: number
  clubImageUrl?: string
}

const FeaturedSection = ({
  clubName,
  totalSocios,
  totalProductos,
  totalReservas,
  totalActivos,
  totalGramos,
  clubImageUrl = "/placeholder.svg?height=400&width=800",
}: FeaturedSectionProps) => {
  return (
    <Card className="relative overflow-hidden border-0 shadow-2xl">
      {/* Background Image with Effects */}
      <div className="absolute inset-0">
        <img src={clubImageUrl || "/placeholder.svg"} alt={clubName} className="w-full h-full object-cover" />
        {/* Multiple overlay layers for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-transparent to-purple-900/20"></div>
        {/* Noise texture overlay for premium feel */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-500/20 rounded-xl backdrop-blur-sm border border-emerald-500/30">
                <Leaf className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
                    {clubName || "Cannabis Club"}
                  </h1>
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 drop-shadow-lg" />
                </div>
                <p className="text-emerald-200/80 text-sm sm:text-base font-medium">
                  Gestión profesional de club cannábico
                </p>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mt-4 sm:mt-0">
            <div className="px-4 py-2 bg-emerald-500/20 backdrop-blur-sm rounded-full border border-emerald-500/30">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-200 text-sm font-medium">Activo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="group">
            <div className="p-3 sm:p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-1.5 bg-blue-500/10 rounded-lg">
                  <Users className="h-4 w-4 text-blue-400/80" />
                </div>
                <div className="text-xs text-white/50 uppercase tracking-wider font-medium">
                  Total Socios
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white/90 drop-shadow-lg">
                {totalSocios.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="group">
            <div className="p-3 sm:p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-1.5 bg-purple-500/10 rounded-lg">
                  <Package className="h-4 w-4 text-purple-400/80" />
                </div>
                <div className="text-xs text-white/50 uppercase tracking-wider font-medium">Productos</div>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white/90 drop-shadow-lg">
                {totalProductos.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="group">
            <div className="p-3 sm:p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-1.5 bg-orange-500/10 rounded-lg">
                  <Calendar className="h-4 w-4 text-orange-400/80" />
                </div>
                <div className="text-xs text-white/50 uppercase tracking-wider font-medium">Reservas</div>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white/90 drop-shadow-lg">
                {totalReservas.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="group">
            <div className="p-3 sm:p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400/80" />
                </div>
                <div className="text-xs text-white/50 uppercase tracking-wider font-medium">Activos</div>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white/90 drop-shadow-lg">
                {totalActivos.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats Bar */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-xs text-white/40 uppercase tracking-wide">Stock Total</div>
                <div className="text-base font-bold text-white/80">{totalGramos}g</div>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs text-white/40">
              <div className="w-1.5 h-1.5 bg-emerald-400/60 rounded-full"></div>
              <span>Última actualización: hace 2 min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-purple-500/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-emerald-500/20 rounded-full blur-lg"></div>
    </Card>
  )
}

export default FeaturedSection
