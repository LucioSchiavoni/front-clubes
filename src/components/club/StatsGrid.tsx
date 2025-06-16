import { Users, Package, Calendar, DollarSign, TrendingUp, Leaf } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsGridProps {
  sociosActivos: number
  productosDisponibles: number
  reservasPendientes: number
  ingresosMes: number
}

const StatsGrid = ({
  sociosActivos,
  productosDisponibles,
  reservasPendientes,
  ingresosMes
}: StatsGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <Card className="">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-slate-200">Socios Activos</CardTitle>
          <Users className="h-4 w-4 text-slate-400" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold dark:text-slate-100">{sociosActivos}</div>
          {/* <p className="text-xs text-slate-400">
            <TrendingUp className="h-3 w-3 inline mr-1" />
            +2 desde el mes pasado
          </p> */}
        </CardContent>
      </Card>

      <Card className="">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-slate-200">Productos Disponibles</CardTitle>
          <Package className="h-4 w-4 text-slate-400" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold dark:text-slate-100">{productosDisponibles}</div>
          <p className="text-xs dark:text-slate-400">
            <Leaf className="h-3 w-3 inline mr-1" />
            En stock
          </p>
        </CardContent>
      </Card>

      <Card className="">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-slate-200">Reservas Pendientes</CardTitle>
          <Calendar className="h-4 w-4 text-slate-400" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold dark:text-slate-100">{reservasPendientes}</div>
          <p className="text-xs dark:text-slate-400">
            <Calendar className="h-3 w-3 inline mr-1" />
            Por recoger
          </p>
        </CardContent>
      </Card>

      <Card className="">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-slate-200">Ingresos del Mes</CardTitle>
          <DollarSign className="h-4 w-4 text-slate-400" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold dark:text-slate-100">€{ingresosMes}</div>
          {/* <p className="text-xs text-slate-400">
            <TrendingUp className="h-3 w-3 inline mr-1" />
            +15% desde el mes pasado
          </p> */}
        </CardContent>
      </Card>
    </div>
  )
}

export default StatsGrid 