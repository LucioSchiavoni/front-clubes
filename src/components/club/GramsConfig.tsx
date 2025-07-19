"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Scale, Save, X, Loader2, CheckCircle2, AlertTriangle } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createGramsClub } from "@/api/club"
import { useClub } from "@/hooks/useClub"

// Schema de validación
const gramsConfigSchema = z
  .object({
    minGrams: z
      .string()
      .optional()
      .refine((val) => {
        if (!val || val === "") return true
        const num = Number.parseFloat(val)
        return !isNaN(num) && num >= 0
      }, "Debe ser un número válido mayor o igual a 0")
      .transform((val) => (val === "" ? undefined : val ? Number.parseFloat(val) : undefined)),
    maxGrams: z
      .string()
      .optional()
      .refine((val) => {
        if (!val || val === "") return true
        const num = Number.parseFloat(val)
        return !isNaN(num) && num >= 0
      }, "Debe ser un número válido mayor o igual a 0")
      .transform((val) => (val === "" ? undefined : val ? Number.parseFloat(val) : undefined)),
  })
  .refine(
    (data) => {
      // Al menos uno debe estar presente
      if (!data.minGrams && !data.maxGrams) {
        return false
      }
      // Si ambos están presentes, min debe ser menor que max
      if (data.minGrams && data.maxGrams) {
        return data.minGrams < data.maxGrams
      }
      return true
    },
    {
      message: "Debe especificar al menos un valor, y el mínimo debe ser menor que el máximo",
      path: ["root"],
    },
  )

type GramsConfigFormInput = {
  minGrams?: string
  maxGrams?: string
}
type GramsConfigForm = z.infer<typeof gramsConfigSchema>

interface GramsConfigModalProps {
  trigger?: React.ReactNode
  onSave?: (data: { minGrams?: number; maxGrams?: number }) => Promise<void>
}

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -20,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
}

const formVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: 0.1,
      staggerChildren: 0.1,
    },
  },
}

const fieldVariants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
    },
  },
}

const buttonVariants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
}

export const GramsConfig = ({ trigger, onSave }: GramsConfigModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<GramsConfigFormInput>({
    resolver: zodResolver(gramsConfigSchema) as any,
  })

  const minGrams = watch("minGrams")
  const maxGrams = watch("maxGrams")

  const { club } = useClub()
  const queryClient = useQueryClient()

  const gramsMutation = useMutation({
    mutationFn: async (data: { minGrams?: number; maxGrams?: number }) => {
      if (!club?.id) throw new Error("No club id")
      return await createGramsClub(club.id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["club"] })
    },
    onError: (error) => {
      toast({
        title: "❌ Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive",
      })
    },
  })

  const handleClose = () => {
    setIsOpen(false)
    reset()
    setIsSuccess(false)
    setIsLoading(false)
  }

  const onSubmit = async (data: GramsConfigForm) => {
    setIsLoading(true)
    try {
      await gramsMutation.mutateAsync({
        ...(data.minGrams !== undefined && { minGrams: data.minGrams }),
        ...(data.maxGrams !== undefined && { maxGrams: data.maxGrams }),
      })
      setIsSuccess(true)
      toast({
        title: "✅ Configuración guardada",
        description: "Los límites de gramos se han actualizado correctamente",
        variant: "default",
      })
      setTimeout(() => {
        handleClose()
      }, 1500)
    } catch (error) {
      // El toast de error ya se muestra en onError
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormSubmit = (data: any) => {
    return onSubmit(data as GramsConfigForm)
  }

  const defaultTrigger = (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2 hover:bg-primary/10 transition-colors bg-transparent"
    >
      <Scale className="h-4 w-4" />
      <span className="hidden sm:inline">Configurar Gramos</span>
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <AnimatePresence>
        {isOpen && (
          <DialogContent className="sm:max-w-md p-0 overflow-hidden">
            <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className="p-6">
              <DialogHeader className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Scale className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-semibold">Configurar Límites de Gramos</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      Establece los valores mínimo y/o máximo permitidos
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <motion.form
                variants={formVariants}
                initial="hidden"
                animate="visible"
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-6"
              >
                {/* Campo Mínimo */}
                <motion.div variants={fieldVariants} className="space-y-2">
                  <Label htmlFor="minGrams" className="flex items-center gap-2 text-sm font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Mínimo de gramos
                    <span className="text-xs text-muted-foreground">(opcional)</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="minGrams"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="Ej: 10.5"
                      className={`bg-background transition-all duration-200 ${
                        errors.minGrams ? "border-red-500 focus:ring-red-200" : "focus:ring-primary/20"
                      } ${isSuccess ? "border-green-500" : ""}`}
                      {...register("minGrams")}
                      disabled={isLoading || isSuccess}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">gr</div>
                  </div>
                  {errors.minGrams && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-500 flex items-center gap-1"
                    >
                      <AlertTriangle className="h-3 w-3" />
                      {errors.minGrams.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Campo Máximo */}
                <motion.div variants={fieldVariants} className="space-y-2">
                  <Label htmlFor="maxGrams" className="flex items-center gap-2 text-sm font-medium">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Máximo de gramos
                    <span className="text-xs text-muted-foreground">(opcional)</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="maxGrams"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="Ej: 100.0"
                      className={`bg-background transition-all duration-200 ${
                        errors.maxGrams ? "border-red-500 focus:ring-red-200" : "focus:ring-primary/20"
                      } ${isSuccess ? "border-green-500" : ""}`}
                      {...register("maxGrams")}
                      disabled={isLoading || isSuccess}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">gr</div>
                  </div>
                  {errors.maxGrams && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-500 flex items-center gap-1"
                    >
                      <AlertTriangle className="h-3 w-3" />
                      {errors.maxGrams.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Error general */}
                <AnimatePresence>
                  {errors.root && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-3 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <p className="text-xs text-red-600 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        {errors.root.message}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Vista previa de valores */}
                <AnimatePresence>
                  {(minGrams || maxGrams) && !errors.root && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <p className="text-xs text-blue-700 font-medium mb-1">Vista previa:</p>
                      <div className="text-xs text-blue-600">
                        {minGrams && maxGrams
                          ? `Rango: ${minGrams}gr - ${maxGrams}gr`
                          : minGrams
                            ? `Mínimo: ${minGrams}gr`
                            : `Máximo: ${maxGrams}gr`}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Botones */}
                <motion.div variants={formVariants} className="flex flex-col sm:flex-row gap-3 pt-4">
                  <motion.div variants={buttonVariants} className="flex-1">
                    <Button type="submit" className="w-full flex items-center gap-2" disabled={isLoading || isSuccess}>
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Guardando...
                        </>
                      ) : isSuccess ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          ¡Guardado!
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Guardar
                        </>
                      )}
                    </Button>
                  </motion.div>
                  <motion.div variants={buttonVariants}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      disabled={isLoading}
                      className="w-full sm:w-auto flex items-center gap-2 bg-transparent"
                    >
                      <X className="h-4 w-4" />
                      Cancelar
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.form>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  )
}
