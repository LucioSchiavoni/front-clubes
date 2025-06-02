import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { UpdateClub } from "@/interface/update-club"
import { updateClub, getClubById } from "@/api/club"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, Database, Loader2, Image as ImageIcon, Upload, AlertCircle, X } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useClub } from "@/hooks/useClub"

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

interface UpdateClubFormProps {
  clubId: string;
  initialData: UpdateClub;
  onSuccess?: () => void;
}

export const UpdateClubForm = ({ clubId, initialData, onSuccess }: UpdateClubFormProps) => {
  const [formData, setFormData] = useState<UpdateClub>(initialData)
  const [isSuccess, setIsSuccess] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { toast } = useToast()
  const { club, isLoading: isLoadingClub } = useClub()
  const queryClient = useQueryClient()

  const updateClubMutation = useMutation({
    mutationFn: async (data: FormData | UpdateClub) => {
      return await updateClub(clubId, data)
    },
    onSuccess: (data) => {
      setFormData(data.data)
      setPreviewImage(null)
      setSelectedFile(null)
      setIsSuccess(true)
      toast({
        title: "Club actualizado exitosamente",
        description: "Los cambios se han guardado correctamente",
        variant: "default",
      })
      // Invalidar las queries relacionadas con el club
      queryClient.invalidateQueries({ queryKey: ['club'] })
      queryClient.invalidateQueries({ queryKey: ['club', clubId] })
      onSuccess?.()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios",
        variant: "destructive",
      })
    }
  })

  // Usar useQuery para obtener los datos actualizados del club
  const { data: updatedClub } = useQuery({
    queryKey: ['club', clubId],
    queryFn: () => getClubById(clubId),
    enabled: !!clubId,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (isSuccess) {
      setIsSuccess(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setImageError(null)

    if (file) {
      // Validar tamaño del archivo
      if (file.size > MAX_FILE_SIZE) {
        setImageError("La imagen no debe superar los 2MB")
        e.target.value = "" // Limpiar el input
        return
      }

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setImageError("El archivo debe ser una imagen")
        e.target.value = "" // Limpiar el input
        return
      }

      // Guardar el archivo
      setSelectedFile(file)

      // Crear una URL temporal para la vista previa
      const imageUrl = URL.createObjectURL(file)
      setPreviewImage(imageUrl)
    }
  }

  const handleRemoveImage = () => {
    setPreviewImage(null)
    setSelectedFile(null)
    const fileInput = document.getElementById('image') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (imageError) {
      toast({
        title: "Error",
        description: imageError,
        variant: "destructive",
      })
      return
    }

    // Si hay una imagen seleccionada, enviar como FormData
    if (selectedFile) {
      const formDataToSend = new FormData()
      
      // Agregar todos los campos del formulario
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== 'image') {
          formDataToSend.append(key, value.toString())
        }
      })

      // Agregar la imagen
      formDataToSend.append('image', selectedFile)

      console.log('Enviando FormData con imagen:', {
        name: formDataToSend.get('name'),
        description: formDataToSend.get('description'),
        image: selectedFile.name
      })

      updateClubMutation.mutate(formDataToSend)
    } else {
      // Si no hay imagen, enviar como JSON
      const jsonData = { ...formData }
      delete jsonData.image // Eliminar la imagen del objeto JSON
      updateClubMutation.mutate(jsonData)
    }
  }

  if (isLoadingClub) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando datos del club...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="flex items-center gap-2">
            Nombre del Club
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Database className="h-3 w-3" />
              <span>{club?.name}</span>
            </div>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            placeholder="Escribe el nuevo nombre del club"
            className={`${isSuccess ? "border-green-500" : ""} bg-background`}
          />
        </div>

        <div>
          <Label htmlFor="description" className="flex items-center gap-2">
            Descripción
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Database className="h-3 w-3" />
              <span>{club?.description || "Sin descripción"}</span>
            </div>
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            placeholder="Escribe la nueva descripción del club"
            className={`${isSuccess ? "border-green-500" : ""} bg-background`}
          />
        </div>

        <div>
          <Label htmlFor="image" className="flex items-center gap-2">
            Imagen del Club
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Database className="h-3 w-3" />
              <span>Imagen actual:</span>
            </div>
          </Label>
          {updatedClub?.data?.image && (
            <div className="mb-2 relative w-32 h-32 rounded-lg overflow-hidden border">
              <img
                src={updatedClub.data.image}
                alt="Imagen actual del club"
                className="w-full h-full object-cover"
              />
              {updateClubMutation.isPending && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={updateClubMutation.isPending}
              />
              <Label
                htmlFor="image"
                className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-accent ${
                  updateClubMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Upload className="h-4 w-4" />
                <span>
                  {updateClubMutation.isPending 
                    ? "Actualizando imagen..." 
                    : "Seleccionar nueva imagen"}
                </span>
              </Label>
              {previewImage && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="text-red-500 hover:text-red-600"
                  disabled={updateClubMutation.isPending}
                >
                  <X className="h-4 w-4" />
                  <span className="ml-1">Eliminar</span>
                </Button>
              )}
            </div>
            {imageError && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span>{imageError}</span>
              </div>
            )}
            {previewImage && (
              <div className="mt-2 relative w-32 h-32 rounded-lg overflow-hidden border">
                <img
                  src={previewImage}
                  alt="Vista previa de la nueva imagen"
                  className="w-full h-full object-cover"
                />
                {updateClubMutation.isPending && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="address" className="flex items-center gap-2">
            Dirección
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Database className="h-3 w-3" />
              <span>{club?.address || "Sin dirección"}</span>
            </div>
          </Label>
          <Input
            id="address"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            placeholder="Escribe la nueva dirección del club"
            className={`${isSuccess ? "border-green-500" : ""} bg-background`}
          />
        </div>

        <div>
          <Label htmlFor="phone" className="flex items-center gap-2">
            Teléfono
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Database className="h-3 w-3" />
              <span>{club?.phone || "Sin teléfono"}</span>
            </div>
          </Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            placeholder="Escribe el nuevo teléfono del club"
            className={`${isSuccess ? "border-green-500" : ""} bg-background`}
          />
        </div>

        <div>
          <Label htmlFor="website" className="flex items-center gap-2">
            Sitio web
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Database className="h-3 w-3" />
              <span>{club?.website || "Sin sitio web"}</span>
            </div>
          </Label>
          <Input
            id="website"
            name="website"
            value={formData.website || ""}
            onChange={handleChange}
            placeholder="Escribe la nueva URL del sitio web"
            className={`${isSuccess ? "border-green-500" : ""} bg-background`}
          />
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={updateClubMutation.isPending || !!imageError}
        >
          {updateClubMutation.isPending ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Guardando cambios...</span>
            </div>
          ) : (
            "Guardar cambios"
          )}
        </Button>
        
        {isSuccess && (
          <div className="text-sm text-green-500 flex items-center justify-center space-x-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Los cambios se han guardado correctamente</span>
          </div>
        )}
      </div>
    </form>
  )
} 