import DefaultLayout from "@/layouts/default"
import { UpdateClubForm } from "@/components/forms/UpdateClubForm"
import { getClubById } from "@/api/club"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useQuery } from "@tanstack/react-query"
import {
  ArrowLeft,
  Settings,
  Building,
  Loader2,
  AlertTriangle,
  RefreshCw,
  MapPin,
  Phone,
  Globe,
  Calendar,
  Users,
  Scale,
} from "lucide-react"
import { GramsConfig } from "@/components/club/GramsConfig"

const ConfigPage = () => {
  const { clubId } = useParams()
  const navigate = useNavigate()

  const {
    data: clubData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["club", clubId],
    queryFn: () => getClubById(clubId!),
    enabled: !!clubId,
    retry: 2,
  })

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleRetry = () => {
    refetch()
  }

  // Estado de carga mejorado
  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
          {/* Header con skeleton */}
          <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded-md animate-pulse" />
                <div className="space-y-2">
                  <div className="w-48 h-6 bg-muted rounded animate-pulse" />
                  <div className="w-32 h-4 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Contenido de carga */}
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center space-y-4">
                      <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Cargando información del club</h3>
                        <p className="text-muted-foreground text-sm">Estamos obteniendo los datos más recientes...</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DefaultLayout>
    )
  }

  // Estado de error mejorado
  if (error) {
    return (
      <DefaultLayout>
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
          {/* Header de error */}
          <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={handleGoBack} className="p-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-destructive">Error al cargar</h1>
                  <p className="text-sm text-muted-foreground">No se pudo obtener la información</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido de error */}
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <Card className="border-destructive/20">
                <CardContent className="p-6">
                  <div className="text-center space-y-6">
                    <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                      <AlertTriangle className="h-8 w-8 text-destructive" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">No se pudo cargar el club</h3>
                      <p className="text-muted-foreground">
                        Hubo un problema al obtener los datos del club. Por favor, verifica tu conexión e intenta
                        nuevamente.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button onClick={handleRetry} className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Intentar nuevamente
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleGoBack}
                        className="flex items-center gap-2 bg-transparent"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Volver atrás
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DefaultLayout>
    )
  }

  const club = clubData?.data

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        {/* Header sticky con información del club */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b shadow-sm">
       
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={handleGoBack} className="p-2 hover:bg-muted">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl font-bold truncate">{club?.name || "Club sin nombre"}</h1>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Settings className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">Configuración del club</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

       

            {/* Formulario de edición */}
            <Card className="rounded-none">
              <CardContent className="p-4 sm:p-6">
                {clubData && clubId && (
                  <UpdateClubForm
                    clubId={clubId}
                    initialData={clubData.data}
                    onSuccess={() => {
                      // Opcional: agregar lógica adicional después del éxito
                    }}
                  />
                )}
              </CardContent>
            </Card>

            {/* Footer informativo */}
            <div className="bg-muted/20 border-dashed">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Los cambios se sincronizan automáticamente</span>
                </div>
              </CardContent>
            </div>
          </div>
        
    </DefaultLayout>
  )
}

export default ConfigPage
