import { useMutation } from "@tanstack/react-query"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Check, User, MapPin, Briefcase, Building2, Image as ImageIcon, Upload } from "lucide-react"
import { registerClub, updateUserClub } from "@/api/club"
import { Club, CreateClub } from "@/interface/create-club"
import { useAuthStore } from "@/store/auth"
import instance from "@/config/axios"

const steps = [
  {
    id: 1,
    title: "Información del Club",
    
    description: "Cuéntanos sobre tu club",
    icon: User,
    fields: ["name", "email"],
    required: true
  },
  {
    id: 2,
    title: "Imagen y Descripción",
    description: "Agrega una imagen y describe tu club",
    icon: ImageIcon,
    fields: ["image", "description"],
    required: false
  },
  {
    id: 3,
    title: "Detalles Adicionales",
    description: "Información adicional del club",
    icon: Briefcase,
    fields: ["website"],
    required: false
  },
  {
    id: 4,
    title: "Ubicación y Contacto",
    description: "¿Dónde podemos encontrarte?",
    icon: MapPin,
    fields: ["address", "phone"],
    required: false
  },
]

const initialFormData: CreateClub = {
  name: "",
  email: "",
  description: "",
  website: "",
  address: "",
  phone: "",
  image: "",
  active: true
}

const AddClubForm = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<CreateClub>(initialFormData)
  const [isComplete, setIsComplete] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { profile, setProfile } = useAuthStore()

  // Verificar si el usuario ya tiene un club
  useEffect(() => {
    console.log('Estado actual del perfil:', profile)
    if (profile?.data?.clubId) {
      console.log('Usuario tiene clubId:', profile.data.clubId)
      window.location.href = '/dashboard'
    }
  }, [profile])

  const mutation = useMutation({
    mutationFn: async (data: { formData: CreateClub; image: File | null }) => {
      const formDataToSend = new FormData()
      
      // Agregar todos los campos del formulario
      Object.entries(data.formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formDataToSend.append(key, value.toString())
        }
      })

      // Agregar la imagen si existe
      if (data.image) {
        formDataToSend.append('image', data.image)
      }

      // Enviar el formulario
      const response = await instance.post("/club", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      console.log('Respuesta de creación del club:', response.data)

      // Verificar que tenemos el ID del usuario y el ID del club
      if (response.data?.id && profile?.data?.id) {
        try {
          console.log('Actualizando clubId del usuario:', {
            userId: profile.data.id,
            clubId: response.data.id
          })
          
          const updateResponse = await updateUserClub(profile.data.id, response.data.id)
          console.log('Respuesta de actualización del usuario:', updateResponse)

          // Actualizar el perfil inmediatamente después de actualizar el clubId
          const updatedProfile = {
            ...profile,
            data: {
              ...profile.data,
              clubId: response.data.id
            }
          }
          console.log('Nuevo perfil a guardar:', updatedProfile)
          setProfile(updatedProfile)
        } catch (error) {
          console.error('Error al actualizar el clubId del usuario:', error)
        }
      }

      return response
    },
    onSuccess: (response) => {
      if (response.data) {
        console.log('Club creado exitosamente:', response.data)
        setShowAlert(true)
        setIsComplete(true)
        // Redirigir al dashboard después de un breve delay
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
      }
    },
    onError: (error) => {
      console.error('Error en la mutación:', error)
      setShowAlert(true)
    }
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      // Crear una URL de vista previa
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const updateFormData = (field: keyof CreateClub, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const validateStep = (step: number) => {
    const currentStepData = steps[step - 1]
    const stepFields = currentStepData.fields

    if (currentStepData.required) {
      return stepFields.every((field) => {
        const value = formData[field as keyof CreateClub]
        return value !== undefined && value.toString().trim() !== ""
      })
    }
    return true
  }

  const nextStep = () => {
    if (currentStep < steps.length && validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!formData.name || !formData.email) {
      setShowAlert(true)
      return
    }
    mutation.mutate({ formData, image: selectedImage })
  }

  const progress = (currentStep / steps.length) * 100

  if (isComplete && mutation.isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">¡Club creado exitosamente!</h2>
              <p className="text-gray-600">
                Serás redirigido al panel de control en unos segundos...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      currentStep >= step.id ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <StepIcon className="w-5 h-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 h-1 mx-2 transition-all duration-300 ${
                        currentStep > step.id ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <CardTitle className="text-2xl font-bold">{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Paso 1: Información del Club */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in slide-in-from-right-5 duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Club *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                      placeholder="Ingresa el nombre de tu club"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>
              )}

              {/* Paso 2: Imagen y Descripción */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in slide-in-from-right-5 duration-300">
                  <div className="space-y-2">
                    <Label>Imagen del Club</Label>
                    <div 
                      onClick={handleImageClick}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                      {imagePreview ? (
                        <div className="space-y-2">
                          <img 
                            src={imagePreview} 
                            alt="Vista previa" 
                            className="mx-auto max-h-48 rounded-lg"
                          />
                          <p className="text-sm text-gray-500">Haz clic para cambiar la imagen</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-500">
                            Haz clic para seleccionar una imagen
                          </p>
                          <p className="text-xs text-gray-400">
                            PNG, JPG o GIF (máx. 5MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => updateFormData("description", e.target.value)}
                      placeholder="Describe tu club"
                    />
                  </div>
                </div>
              )}

              {/* Paso 3: Detalles Adicionales */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in slide-in-from-right-5 duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="website">Sitio Web</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => updateFormData("website", e.target.value)}
                      placeholder="https://tuclub.com"
                    />
                  </div>
                </div>
              )}

              {/* Paso 4: Ubicación y Contacto */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-in slide-in-from-right-5 duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => updateFormData("address", e.target.value)}
                      placeholder="Ingresa la dirección del club"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      placeholder="Ingresa el teléfono de contacto"
                    />
                  </div>
                </div>
              )}

              {/* Botones de navegación */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </Button>

                {currentStep === steps.length ? (
                  <Button
                    type="submit"
                    disabled={!validateStep(currentStep) || mutation.isPending}
                    className="flex items-center space-x-2"
                  >
                    {mutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creando...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Crear Club</span>
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!validateStep(currentStep)}
                    className="flex items-center space-x-2"
                  >
                    <span>Siguiente</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      {/* Alertas de éxito o error */}
      {showAlert && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          {mutation.isSuccess ? (
            <div className="bg-gray-800 border border-green-500/20 rounded-lg shadow-2xl p-4 min-w-[320px] max-w-md">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-green-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-green-400">¡Club creado exitosamente!</h3>
                    <button
                      onClick={() => setShowAlert(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">Tu club ha sido creado y está pendiente de aprobación.</p>
                </div>
              </div>
              <div className="mt-3 w-full bg-gray-700 rounded-full h-1">
                <div className="bg-green-500 h-1 rounded-full animate-pulse" style={{ width: "100%" }} />
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 border border-red-500/20 rounded-lg shadow-2xl p-4 min-w-[320px] max-w-md">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-red-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-red-400">Error al crear el club</h3>
                    <button
                      onClick={() => setShowAlert(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">
                    Hubo un problema al crear el club. Por favor, inténtalo de nuevo.
                  </p>
                </div>
              </div>
              <div className="mt-3 w-full bg-gray-700 rounded-full h-1">
                <div className="bg-red-500 h-1 rounded-full animate-pulse" style={{ width: "100%" }} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AddClubForm