import React, { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAuthStore } from "@/store/auth"
import { registerRequest } from "@/api/auth"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface AddSocioFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: FormData) => void
}

const AddSocioForm = ({ isOpen, onClose, onSubmit }: AddSocioFormProps) => {
  const { profile } = useAuthStore()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    repeatPassword: '',
    phone: '',
    address: '',
    rol: 'USER',
    active: true,
    clubId: profile?.data?.clubId || ''
  })

  const [errors, setErrors] = useState({
    password: '',
    repeatPassword: '',
    email: '',
    general: ''
  })

  const registerMutation = useMutation({
    mutationFn: (userData: any) => registerRequest(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socios'] })
      const data = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'repeatPassword') {
          data.append(key, value.toString())
        }
      })
      onSubmit(data)
      onClose()
      // Limpiar el formulario
      setFormData({
        name: '',
        email: '',
        password: '',
        repeatPassword: '',
        phone: '',
        address: '',
        rol: 'USER',
        active: true,
        clubId: profile?.data?.clubId || ''
      })
    },
    onError: (error: any) => {
      console.error('Error al registrar socio:', error)
      if (error.response?.data?.message) {
        setErrors(prev => ({
          ...prev,
          general: error.response.data.message
        }))
        toast.error(error.response.data.message)
      } else {
        setErrors(prev => ({
          ...prev,
          general: 'Error al registrar el socio'
        }))
        toast.error('Error al registrar el socio')
      }
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({ password: '', repeatPassword: '', email: '', general: '' })
    
    // Validar contraseñas
    if (formData.password !== formData.repeatPassword) {
      setErrors(prev => ({
        ...prev,
        repeatPassword: 'Las contraseñas no coinciden'
      }))
      return
    }

    if (formData.password.length < 6) {
      setErrors(prev => ({
        ...prev,
        password: 'La contraseña debe tener al menos 6 caracteres'
      }))
      return
    }

    // Preparar datos para el registro
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: formData.address,
      rol: formData.rol,
      active: formData.active,
      clubId: profile?.data?.clubId
    }

    registerMutation.mutate(userData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Limpiar errores cuando el usuario modifica los campos
    if (name === 'password' || name === 'repeatPassword' || name === 'email') {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl border-green-200">
        <DialogHeader>
          <DialogTitle className="text-green-800 flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <UserPlus className="h-5 w-5 text-green-600" />
            </div>
            Agregar Nuevo Socio
          </DialogTitle>
          <DialogDescription className="text-green-600">
            Completa la información del nuevo socio del club cannábico.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {errors.general && (
            <div className="col-span-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
              {errors.general}
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-green-700 font-medium">
              Nombre
            </Label>
            <Input 
              id="name" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="col-span-3 border-green-200 focus:border-green-500 rounded-lg" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right text-green-700 font-medium">
              Email
            </Label>
            <div className="col-span-3">
              <Input 
                id="email" 
                name="email"
                type="email" 
                value={formData.email}
                onChange={handleChange}
                required
                className={`border-green-200 focus:border-green-500 rounded-lg ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right text-green-700 font-medium">
              Contraseña
            </Label>
            <div className="col-span-3">
              <Input 
                id="password" 
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`border-green-200 focus:border-green-500 rounded-lg ${errors.password ? 'border-red-500' : ''}`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="repeatPassword" className="text-right text-green-700 font-medium">
              Repetir Contraseña
            </Label>
            <div className="col-span-3">
              <Input 
                id="repeatPassword" 
                name="repeatPassword"
                type="password"
                value={formData.repeatPassword}
                onChange={handleChange}
                required
                className={`border-green-200 focus:border-green-500 rounded-lg ${errors.repeatPassword ? 'border-red-500' : ''}`}
              />
              {errors.repeatPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.repeatPassword}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right text-green-700 font-medium">
              Teléfono
            </Label>
            <Input 
              id="phone" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="col-span-3 border-green-200 focus:border-green-500 rounded-lg" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right text-green-700 font-medium">
              Dirección
            </Label>
            <Input 
              id="address" 
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="col-span-3 border-green-200 focus:border-green-500 rounded-lg" 
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              type="button"
              variant="outline" 
              onClick={onClose} 
              className="border-green-200 text-green-700 hover:bg-green-50 rounded-lg"
              disabled={registerMutation.isPending}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? 'Registrando...' : 'Agregar Socio'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddSocioForm