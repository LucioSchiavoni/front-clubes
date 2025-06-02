
import DefaultLayout from "@/layouts/default"
import { UpdateClubForm } from "@/components/forms/UpdateClubForm"
import { getClubById } from "@/api/club"
import { useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery } from "@tanstack/react-query"

const ConfigPage = () => {
  const { clubId } = useParams()

  const { data: clubData, isLoading, error } = useQuery({
    queryKey: ['club', clubId],
    queryFn: () => getClubById(clubId!),
    enabled: !!clubId,
  })

  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p>Cargando...</p>
        </div>
      </DefaultLayout>
    )
  }

  if (error) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p>Error al cargar los datos del club</p>
        </div>
      </DefaultLayout>
    )
  }

  return (
    <DefaultLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Configuración</h1>
        
        <Tabs defaultValue="club" className="space-y-4">
          <TabsList>
            <TabsTrigger value="club">Club</TabsTrigger>
            <TabsTrigger value="user">Usuario</TabsTrigger>
          </TabsList>

          <TabsContent value="club">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Club</CardTitle>
              </CardHeader>
              <CardContent>
                {clubData && clubId && (
                  <UpdateClubForm 
                    clubId={clubId}
                    initialData={clubData}
                    onSuccess={() => {
                      // La revalidación se maneja automáticamente con React Query
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="user">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Usuario</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Aquí irá el formulario de configuración de usuario */}
                <p>Configuración de usuario próximamente...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DefaultLayout>
  )
}

export default ConfigPage