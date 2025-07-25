import React, { useState } from 'react'
import { PackagePlus, Edit, AlertTriangle, CheckCircle, Upload, X } from 'lucide-react'
import type { Product } from '@/hooks/useProducts'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ProductFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: FormData) => Promise<{ success: boolean; message?: string; error?: string }>
  product?: Product
  title: string
  description: string
}

// Constantes para validación
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

export const ProductForm = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  title,
  description
}: ProductFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  // Función para validar el archivo
  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: 'El archivo es demasiado grande. Tamaño máximo: 10MB'
      }
    }

    // Validar tipo MIME
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: 'Tipo de archivo no válido. Solo se permiten: JPG, PNG, WEBP'
      }
    }

    // Validar extensión
    const extension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return {
        isValid: false,
        error: 'Extensión de archivo no válida'
      }
    }

    return { isValid: true }
  }

  // Manejar cambio de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setError(null) // Limpiar errores previos

    if (!file) {
      setFilePreview(null)
      setFileName(null)
      return
    }

    // Validar archivo
    const validation = validateFile(file)
    if (!validation.isValid) {
      setError(validation.error!)
      e.target.value = '' // Limpiar input
      setFilePreview(null)
      setFileName(null)
      return
    }

    // Crear preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setFilePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    setFileName(file.name)
  }

  // Limpiar archivo seleccionado
  const clearFile = () => {
    const fileInput = document.getElementById('image') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
    setFilePreview(null)
    setFileName(null)
    setError(null)
  }

  // Formatear mensajes de error del backend
  const formatBackendError = (error: string, message: string): string => {
    const errorMessages: Record<string, string> = {
      'FILE_TOO_LARGE': 'El archivo es demasiado grande. Tamaño máximo: 10MB',
      'INVALID_FILE_TYPE': 'Tipo de archivo no válido. Solo se permiten: JPG, PNG, WEBP',
      'INVALID_FILE_EXTENSION': 'Extensión de archivo no válida',
      'TOO_MANY_FILES': 'Solo se permite un archivo',
      'UNEXPECTED_FIELD': 'Campo de archivo no esperado',
      'MISSING_FILE': 'Se requiere una imagen',
      'UPLOAD_ERROR': 'Error al subir el archivo',
      'PROCESSING_ERROR': 'Error al procesar el archivo'
    }

    return errorMessages[error] || message || 'Error desconocido al procesar el archivo'
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData(e.currentTarget)
      
      // Validación adicional si hay archivo
      const fileInput = e.currentTarget.querySelector('#image') as HTMLInputElement
      const file = fileInput?.files?.[0]
      
      if (file) {
        const validation = validateFile(file)
        if (!validation.isValid) {
          setError(validation.error!)
          setIsSubmitting(false)
          return
        }
      }

      const result = await onSubmit(formData)
      
      if (result.success) {
        setSuccess(result.message || 'Operación exitosa')
        // Cerrar modal después de un breve delay
        setTimeout(() => {
          onClose()
          setSuccess(null)
          setError(null)
          setFilePreview(null)
          setFileName(null)
        }, 1500)
      } else {
        // Manejar errores del backend
        if (result.error) {
          setError(formatBackendError(result.error, result.message || ''))
        } else {
          setError(result.message || 'Error desconocido')
        }
      }
    } catch (error: any) {
      console.error('Error al enviar formulario:', error)
      
      // Intentar extraer información del error
      if (error.response?.data) {
        const { error: errorCode, message } = error.response.data
        setError(formatBackendError(errorCode, message))
      } else {
        setError('Error de conexión. Inténtalo de nuevo.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setError(null)
      setSuccess(null)
      setFilePreview(null)
      setFileName(null)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl border-green-800">
        <DialogHeader>
          <DialogTitle className="text-green-800 flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              {product ? (
                <Edit className="h-5 w-5 text-green-800" />
              ) : (
                <PackagePlus className="h-5 w-5 text-green-800" />
              )}
            </div>
            {title}
          </DialogTitle>
          <DialogDescription className="text-green-800">
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* Alertas de error y éxito */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-green-800 font-medium">
                Nombre
              </Label>
              <Input 
                id="name" 
                name="name"
                defaultValue={product?.name}
                required
                disabled={isSubmitting}
                className="col-span-3 border-green-200 focus:border-green-500 rounded-lg" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right text-green-800 font-medium">
                Categoría
              </Label>
              <Select name="category" defaultValue={product?.category} required disabled={isSubmitting}>
                <SelectTrigger className="col-span-3 border-green-200 focus:border-green-500 rounded-lg">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-green-200">
                  <SelectItem value="sativa">🌱 Sativa</SelectItem>
                  <SelectItem value="indica">🍃 Indica</SelectItem>
                  <SelectItem value="hibrida">🌿 Híbrida</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="thc" className="text-right text-green-800 font-medium">
                THC %
              </Label>
              <Input 
                id="thc" 
                name="thc"
                type="number"
                defaultValue={product?.thc}
                required
                disabled={isSubmitting}
                className="col-span-3 border-green-200 focus:border-green-500 rounded-lg" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="CBD" className="text-right text-green-800 font-medium">
                CBD %
              </Label>
              <Input 
                id="CBD" 
                name="CBD"
                type="number"
                defaultValue={product?.CBD}
                required
                disabled={isSubmitting}
                className="col-span-3 border-green-200 focus:border-green-500 rounded-lg" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right text-green-800 font-medium">
                Precio €
              </Label>
              <Input 
                id="price" 
                name="price"
                type="number" 
                step="0.01"
                defaultValue={product?.price}
                required
                disabled={isSubmitting}
                className="col-span-3 border-green-200 focus:border-green-500 rounded-lg" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right text-green-800 font-medium">
                Stock
              </Label>
              <Input 
                id="stock" 
                name="stock"
                type="number"
                defaultValue={product?.stock}
                required
                disabled={isSubmitting}
                className="col-span-3 border-green-200 focus:border-green-500 rounded-lg" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right text-green-800 font-medium">
                Descripción
              </Label>
              <Textarea 
                id="description" 
                name="description"
                defaultValue={product?.description}
                required
                disabled={isSubmitting}
                className="col-span-3 border-green-200 focus:border-green-500 rounded-lg" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right text-green-800 font-medium">
                Imagen
              </Label>
              <div className="col-span-3 space-y-2">
                <div className="relative">
                  <Input 
                    id="image" 
                    name="image"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                    className="border-green-200 focus:border-green-500 rounded-lg" 
                  />
                  {fileName && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearFile}
                      disabled={isSubmitting}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-red-100"
                    >
                      <X className="h-3 w-3 text-red-500" />
                    </Button>
                  )}
                </div>
                
                {/* Preview de la imagen */}
                {filePreview && (
                  <div className="relative w-full h-20 border border-green-200 rounded-lg overflow-hidden">
                    <img 
                      src={filePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                      {fileName}
                    </div>
                  </div>
                )}
                
                <p className="text-sm text-green-600">
                  Formatos: JPG, PNG, WEBP. Máximo: 10MB
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              type="button"
              variant="outline" 
              onClick={handleClose}
              disabled={isSubmitting}
              className="border-green-200 hover:text-green-800 text-green-800 hover:bg-green-50 rounded-lg"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  {product ? 'Guardando...' : 'Agregando...'}
                </>
              ) : (
                product ? 'Guardar Cambios' : 'Agregar Producto'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}