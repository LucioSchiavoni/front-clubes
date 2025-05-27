import React, { useState } from 'react'
import { AlertCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMutation } from "@tanstack/react-query"
import { registerRequest } from "@/api/auth"
import {
    Alert,
    AlertDescription,
    AlertTitle,
  } from "@/components/ui/alert"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FormData {
  name: string
  email: string
  rol: string
  password: string
}

const AddUserForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    rol: "",
    password: ""
  })

  const mutation = useMutation({
    mutationFn: (userData: FormData) => registerRequest(userData),
    onSuccess: () => {
      setShowAlert(true)
      const timer = setTimeout(() => {
        setShowAlert(false)
      }, 6000)
      
      resetForm()
      setIsModalOpen(false)
      
      return () => clearTimeout(timer)
    },
    onError: (error: any) => {
      setShowAlert(error)
      const timer = setTimeout(() => {
        setShowAlert(false)
      }, 6000)
      
      return () => clearTimeout(timer)
    }
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(formData)
  }
  
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      rol: "",
      password: ""
    })
  }

  return (
    <div className="flex justify-end mb-6">
           {showAlert && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          {mutation.isSuccess ? (
            <div className="bg-gray-800 border border-green-500/20 rounded-lg shadow-2xl p-4 min-w-[320px] max-w-md">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-green-400">¡Usuario creado exitosamente!</h3>
                    <button
                      onClick={() => setShowAlert(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">El usuario ha sido agregado al sistema correctamente.</p>
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={() => setShowAlert(false)}
                      className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-md hover:bg-green-500/30 transition-colors"
                    >
                      Entendido
                    </button>
                   
                  </div>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-3 w-full bg-gray-700 rounded-full h-1">
                <div className="bg-green-500 h-1 rounded-full animate-pulse" style={{ width: "100%" }} />
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 border border-red-500/20 rounded-lg shadow-2xl p-4 min-w-[320px] max-w-md">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-red-400">Error al crear usuario</h3>
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
                    Hubo un problema al crear el usuario. Por favor, inténtalo de nuevo.
                  </p>
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={() => {
                        setShowAlert(false)
                        setIsModalOpen(true)
                      }}
                      className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-md hover:bg-red-500/30 transition-colors"
                    >
                      Reintentar
                    </button>
                    <button
                      onClick={() => setShowAlert(false)}
                      className="text-xs bg-gray-700 text-gray-300 px-3 py-1 rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-3 w-full bg-gray-700 rounded-full h-1">
                <div className="bg-red-500 h-1 rounded-full animate-pulse" style={{ width: "100%" }} />
              </div>
            </div>
          )}
        </div>
      )}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Usuario
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-800 border-gray-700 text-white w-[95vw] sm:max-w-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Dar de Alta Usuario</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-300 text-sm sm:text-base">
                Nombre *
              </Label>
              <Input
                id="firstName"
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 h-10 sm:h-11"
                placeholder="Ingresa el nombre"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 text-sm sm:text-base">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 h-10 sm:h-11"
                placeholder="usuario@ejemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contraseña" className="text-gray-300 text-sm sm:text-base">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 h-10 sm:h-11"
                placeholder="Ingresa tu contraseña"
              />
            </div>

            {/* Rol */}
            <div className="space-y-2">
              <Label className="text-white text-sm sm:text-base">Rol *</Label>
              <Select value={formData.rol} onValueChange={(value: string) => handleInputChange("rol", value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white h-10 sm:h-11">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="CLUB">Club</SelectItem>
                  <SelectItem value="SOCIO">Socio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm()
                  setIsModalOpen(false)
                }}
                className="border-gray-600 text-white bg-blue-600 hover:bg-gray-700 w-full sm:w-auto"
                disabled={mutation.isPending}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Creando..." : "Crear Usuario"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddUserForm