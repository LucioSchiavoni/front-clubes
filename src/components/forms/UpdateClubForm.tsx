"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import type { UpdateClub } from "@/interface/update-club"
import { updateClub, getClubById } from "@/api/club"
import { useToast } from "@/hooks/use-toast"
import {
  CheckCircle2,
  Loader2,
  Upload,
  AlertCircle,
  X,
  Edit3,
  Save,
  XCircle,
  MapPin,
  Phone,
  Globe,
  FileText,
  Building,
  ImageIcon,
  Scale,
} from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useClub } from "@/hooks/useClub"
import { GramsConfig } from "../club/GramsConfig"

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

interface UpdateClubFormProps {
  clubId: string
  initialData: UpdateClub
  onSuccess?: () => void
}

type EditingField = "name" | "description" | "address" | "phone" | "website" | "image" | null

// Variantes de animación
const fieldVariants = {
  reading: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  editing: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
}

const editFormVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
      delay: 0.1,
    },
  },
}

const buttonContainerVariants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      delay: 0.2,
      staggerChildren: 0.1,
    },
  },
}

const buttonVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
}

const savedIndicatorVariants = {
  hidden: {
    opacity: 0,
    x: -20,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    scale: 0.8,
    transition: {
      duration: 0.3,
    },
  },
}

export const UpdateClubForm = ({ clubId, initialData, onSuccess }: UpdateClubFormProps) => {
  const [formData, setFormData] = useState<UpdateClub>(initialData)
  const [editingField, setEditingField] = useState<EditingField>(null)
  const [savedFields, setSavedFields] = useState<Set<string>>(new Set())
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
    onSuccess: (data, variables) => {
      setFormData(data.data)
      setPreviewImage(null)
      setSelectedFile(null)
      setEditingField(null)

      // Marcar el campo como guardado
      if (editingField) {
        setSavedFields((prev) => new Set([...prev, editingField]))
        // Remover la marca después de 3 segundos
        setTimeout(() => {
          setSavedFields((prev) => {
            const newSet = new Set(prev)
            newSet.delete(editingField!)
            return newSet
          })
        }, 3000)
      }

      toast({
        title: "✅ Campo actualizado",
        description: `${getFieldLabel(editingField)} se ha guardado correctamente`,
        variant: "default",
      })

      queryClient.invalidateQueries({ queryKey: ["club"] })
      queryClient.invalidateQueries({ queryKey: ["club", clubId] })
      onSuccess?.()
    },
    onError: (error) => {
      toast({
        title: "❌ Error",
        description: "No se pudo guardar el cambio",
        variant: "destructive",
      })
    },
  })

  const { data: updatedClub } = useQuery({
    queryKey: ["club", clubId],
    queryFn: () => getClubById(clubId),
    enabled: !!clubId,
  })

  const getFieldLabel = (field: EditingField) => {
    const labels = {
      name: "Nombre del club",
      description: "Descripción",
      address: "Dirección",
      phone: "Teléfono",
      website: "Sitio web",
      image: "Imagen",
    }
    return field ? labels[field] : ""
  }

  const getFieldIcon = (field: string) => {
    const icons = {
      name: Building,
      description: FileText,
      address: MapPin,
      phone: Phone,
      website: Globe,
      image: ImageIcon,
    }
    const IconComponent = icons[field as keyof typeof icons]
    return IconComponent ? <IconComponent className="h-4 w-4" /> : null
  }

  const handleEdit = (field: EditingField) => {
    setEditingField(field)
    setSavedFields((prev) => {
      const newSet = new Set(prev)
      newSet.delete(field!)
      return newSet
    })
  }

  const handleCancel = () => {
    setEditingField(null)
    setFormData(initialData)
    setPreviewImage(null)
    setSelectedFile(null)
    setImageError(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setImageError(null)

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setImageError("La imagen no debe superar los 2MB")
        e.target.value = ""
        return
      }

      if (!file.type.startsWith("image/")) {
        setImageError("El archivo debe ser una imagen")
        e.target.value = ""
        return
      }

      setSelectedFile(file)
      const imageUrl = URL.createObjectURL(file)
      setPreviewImage(imageUrl)
    }
  }

  const handleSave = async (field: EditingField) => {
    if (imageError) {
      toast({
        title: "Error",
        description: imageError,
        variant: "destructive",
      })
      return
    }

    if (field === "image" && selectedFile) {
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== "image") {
          formDataToSend.append(key, value.toString())
        }
      })
      formDataToSend.append("image", selectedFile)
      updateClubMutation.mutate(formDataToSend)
    } else {
      const jsonData = { ...formData }
      delete jsonData.image
      updateClubMutation.mutate(jsonData)
    }
  }

  if (isLoadingClub) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando datos del club...</span>
      </motion.div>
    )
  }

  const renderField = (
    fieldName: keyof UpdateClub,
    currentValue: string | undefined,
    placeholder: string,
    type: "input" | "textarea" = "input",
  ) => {
    const isEditing = editingField === fieldName
    const isSaved = savedFields.has(fieldName)
    const isLoading = updateClubMutation.isPending && editingField === fieldName

    return (
      <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className={`transition-all duration-300 ${isSaved ? "ring-2 ring-green-500 bg-green-50/50" : ""}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <Label className="flex items-center gap-2 text-sm font-medium mb-3">
                  {getFieldIcon(fieldName)}
                  {getFieldLabel(fieldName)}
                  <AnimatePresence>
                    {isSaved && (
                      <motion.div
                        variants={savedIndicatorVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex items-center gap-1 text-green-600 text-xs"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Guardado</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Label>

                <div className="relative min-h-[40px]">
                  <AnimatePresence mode="wait">
                    {!isEditing ? (
                      <motion.div
                        key="reading"
                        variants={fieldVariants}
                        initial="reading"
                        animate="reading"
                        exit="editing"
                        className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md min-h-[40px] flex items-center hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => handleEdit(fieldName)}
                      >
                        {currentValue || `Sin ${getFieldLabel(fieldName).toLowerCase()}`}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="editing"
                        variants={editFormVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="space-y-3"
                      >
                        {type === "textarea" ? (
                          <Textarea
                            name={fieldName}
                            value={formData[fieldName] || ""}
                            onChange={handleChange}
                            placeholder={placeholder}
                            className="bg-background focus:ring-2 focus:ring-primary/20"
                            rows={3}
                            autoFocus
                          />
                        ) : (
                          <Input
                            name={fieldName}
                            value={formData[fieldName] || ""}
                            onChange={handleChange}
                            placeholder={placeholder}
                            className="bg-background focus:ring-2 focus:ring-primary/20"
                            autoFocus
                          />
                        )}

                        <motion.div
                          variants={buttonContainerVariants}
                          initial="hidden"
                          animate="visible"
                          className="flex gap-2"
                        >
                          <motion.div variants={buttonVariants}>
                            <Button
                              size="sm"
                              onClick={() => handleSave(fieldName)}
                              disabled={isLoading}
                              className="flex items-center gap-1"
                            >
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-1">
                                {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                                Guardar
                              </motion.div>
                            </Button>
                          </motion.div>
                          <motion.div variants={buttonVariants}>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancel}
                              disabled={isLoading}
                              className="flex items-center gap-1 bg-transparent"
                            >
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-1">
                                <XCircle className="h-3 w-3" />
                                Cancelar
                              </motion.div>
                            </Button>
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <AnimatePresence>
                {!isEditing && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(fieldName)}
                      className="flex items-center gap-1 text-muted-foreground hover:text-foreground hover:bg-primary/10"
                    >
                      <motion.div whileHover={{ scale: 1.1, rotate: 12, transition: { duration: 0.2 } }} whileTap={{ scale: 0.9 }} className="flex items-center gap-1">
                        <Edit3 className="h-3 w-3" />
                      </motion.div>
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const renderImageField = () => {
    const isEditing = editingField === "image"
    const isSaved = savedFields.has("image")
    const isLoading = updateClubMutation.isPending && editingField === "image"

    return (
      <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className={`transition-all duration-300 ${isSaved ? "ring-2 ring-green-500 bg-green-50/50" : ""}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <Label className="flex items-center gap-2 text-sm font-medium mb-3">
                  <ImageIcon className="h-4 w-4" />
                  Imagen del club
                  <AnimatePresence>
                    {isSaved && (
                      <motion.div
                        variants={savedIndicatorVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex items-center gap-1 text-green-600 text-xs"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Guardado</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Label>

                <div className="relative min-h-[128px]">
                  <AnimatePresence mode="wait">
                    {!isEditing ? (
                      <motion.div
                        key="image-reading"
                        variants={fieldVariants}
                        initial="reading"
                        animate="reading"
                        exit="editing"
                        className="space-y-2 cursor-pointer"
                        onClick={() => handleEdit("image")}
                      >
                        {updatedClub?.data?.image ? (
                          <motion.div
                            className="relative w-32 h-32 rounded-lg overflow-hidden border"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            <img
                              src={updatedClub.data.image || "/placeholder.svg"}
                              alt="Imagen del club"
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                        ) : (
                          <motion.div
                            className="w-32 h-32 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors"
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="text-center text-muted-foreground">
                              <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                              <span className="text-xs">Sin imagen</span>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="image-editing"
                        variants={editFormVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="space-y-3"
                      >
                        <div className="flex flex-col gap-3">
                          <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            disabled={isLoading}
                          />
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Label
                              htmlFor="image-upload"
                              className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-accent w-fit"
                            >
                              <Upload className="h-4 w-4" />
                              Seleccionar imagen
                            </Label>
                          </motion.div>

                          <AnimatePresence>
                            {imageError && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-2 text-sm text-red-500"
                              >
                                <AlertCircle className="h-4 w-4" />
                                <span>{imageError}</span>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <AnimatePresence>
                            {previewImage && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="relative w-32 h-32 rounded-lg overflow-hidden border"
                              >
                                <img
                                  src={previewImage || "/placeholder.svg"}
                                  alt="Vista previa"
                                  className="w-full h-full object-cover"
                                />
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="destructive"
                                    className="absolute top-1 right-1 h-6 w-6 p-0"
                                    onClick={() => {
                                      setPreviewImage(null)
                                      setSelectedFile(null)
                                      const input = document.getElementById("image-upload") as HTMLInputElement
                                      if (input) input.value = ""
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </motion.div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <motion.div
                          variants={buttonContainerVariants}
                          initial="hidden"
                          animate="visible"
                          className="flex gap-2"
                        >
                          <motion.div variants={buttonVariants}>
                            <Button
                              size="sm"
                              onClick={() => handleSave("image")}
                              disabled={isLoading || !selectedFile || !!imageError}
                              className="flex items-center gap-1"
                            >
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-1">
                                {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                                Guardar
                              </motion.div>
                            </Button>
                          </motion.div>
                          <motion.div variants={buttonVariants}>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancel}
                              disabled={isLoading}
                              className="flex items-center gap-1 bg-transparent"
                            >
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-1">
                                <XCircle className="h-3 w-3" />
                                Cancelar
                              </motion.div>
                            </Button>
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <AnimatePresence>
                {!isEditing && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit("image")}
                      className="flex items-center gap-1 text-muted-foreground hover:text-foreground hover:bg-primary/10"
                    >
                      <motion.div whileHover={{ scale: 1.1, rotate: 12, transition: { duration: 0.2 } }} whileTap={{ scale: 0.9 }} className="flex items-center gap-1">
                        <Edit3 className="h-3 w-3" />
                      </motion.div>
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="space-y-4 max-w-2xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold">Editar información del club</h2>
      </motion.div>

      <motion.div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-center text-gray-300">Establecer cantidad de gramos para reserva</p>
      <GramsConfig
             trigger={
              <Button
                variant="outline"
                size="sm"
                className="flex items-center w-full gap-2 hover:bg-primary/10 transition-colors bg-transparent"
              >
                
                <Scale className="h-4 w-4" />
                <span className="">Configurar Límites</span>
              </Button>
            }
          />
      </motion.div>

      {renderField("name", club?.name, "Escribe el nombre del club")}
      {renderField("description", club?.description, "Escribe la descripción del club", "textarea")}
      {renderImageField()}
      {renderField("address", club?.address, "Escribe la dirección del club")}
      {renderField("phone", club?.phone, "Escribe el teléfono del club")}
      {renderField("website", club?.website, "Escribe la URL del sitio web")}
    </motion.div>
  )
}
