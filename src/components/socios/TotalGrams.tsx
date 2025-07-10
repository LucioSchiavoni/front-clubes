"use client"

import { useAuthStore } from "@/store/auth"
import { useGramsBySocio } from "@/hooks/useGramsBySocio"
import { Loader2, Calendar, Package, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface ConsumptionData {
  id?: string
  month: number
  year: number
  totalGrams: number
  totalOrders: number
  lastUpdated: string
}

const ConsumptionHistory = () => {
  const { profile } = useAuthStore()
  const { data, isLoading, error } = useGramsBySocio(profile?.data.id || "")

  // Función para obtener el nombre del mes
  const getMonthName = (month: number): string => {
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ]
    return months[month - 1] || "Mes desconocido"
  }

  // Función para calcular la tendencia
  const getTrend = (currentData: ConsumptionData, previousData?: ConsumptionData) => {
    if (!previousData) return null

    const currentTotal = currentData.totalGrams
    const previousTotal = previousData.totalGrams

    if (currentTotal > previousTotal) return "up"
    if (currentTotal < previousTotal) return "down"
    return "equal"
  }

  // Función para calcular el porcentaje de cambio
  const getPercentageChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100)
  }

  // Función para formatear la fecha
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Cargando historial de consumo...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <Package className="h-6 w-6 text-red-600" />
          </div>
          <p className="text-sm text-red-700 dark:text-red-400 text-center">Error al cargar el historial de consumo</p>
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            Historial de Consumo
          </CardTitle>
          <CardDescription>Registro mensual de gramos reservados</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Sin datos disponibles</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-sm">
            No se encontraron registros de consumo para mostrar en el historial
          </p>
        </CardContent>
      </Card>
    )
  }


  const sortedData = [...data].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year
    return b.month - a.month
  })

  // Calcular totales
  const totalGrams = sortedData.reduce((sum, item) => sum + item.totalGrams, 0)
  const totalOrders = sortedData.reduce((sum, item) => sum + item.totalOrders, 0)
  const averageGramsPerMonth = Math.round(totalGrams / sortedData.length)

  return (
    <div className="space-y-6 p-8">
      {/* Header con estadísticas generales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            Historial de Consumo
          </CardTitle>
          <CardDescription>Registro detallado de gramos reservados por mes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{totalGrams}g</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Acumulado</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{totalOrders}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Órdenes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">{averageGramsPerMonth}g</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Promedio Mensual</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de registros mensuales */}
      <div className="space-y-4">
        {sortedData.map((item: ConsumptionData, index: number) => {
          const previousItem = sortedData[index + 1]
          const trend = getTrend(item, previousItem)
          const percentageChange = previousItem ? getPercentageChange(item.totalGrams, previousItem.totalGrams) : 0

          return (
            <Card key={item.id || `${item.year}-${item.month}`} className="transition-all duration-200 hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {getMonthName(item.month)} {item.year}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Período de consumo</p>
                    </div>
                  </div>

                  {/* Indicador de tendencia */}
                  {trend && (
                    <Badge
                      variant="outline"
                      className={`
                      ${trend === "up" ? "border-green-200 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400" : ""}
                      ${trend === "down" ? "border-red-200 text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400" : ""}
                      ${trend === "equal" ? "border-gray-200 text-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-gray-400" : ""}
                    `}
                    >
                      {trend === "up" && <TrendingUp className="h-3 w-3 mr-1" />}
                      {trend === "down" && <TrendingDown className="h-3 w-3 mr-1" />}
                      {trend === "equal" && <Minus className="h-3 w-3 mr-1" />}
                      {trend === "up" && `+${percentageChange}%`}
                      {trend === "down" && `${percentageChange}%`}
                      {trend === "equal" && "Sin cambio"}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800 dark:text-green-200">Gramos Reservados</span>
                    </div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">{item.totalGrams}g</div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Número de Órdenes</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{item.totalOrders}</div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Promedio por orden:</span>
                  <span className="font-medium">
                    {item.totalOrders > 0 ? Math.round(item.totalGrams / item.totalOrders) : 0}g
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mt-2">
                  <span>Última actualización:</span>
                  <span>{formatDate(item.lastUpdated)}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Footer con información adicional */}
      <Card className="bg-gray-50 dark:bg-gray-800/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4 mr-2" />
            Mostrando {sortedData.length} {sortedData.length === 1 ? "registro" : "registros"} de consumo
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ConsumptionHistory
