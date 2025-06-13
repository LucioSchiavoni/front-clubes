import React, { useState } from 'react'
import { UserPlus, Mail, Lock, Phone, MapPin, User } from 'lucide-react'
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
    onSuccess: (response) => {
      if (response.status === 409) {
        setFormData(prev => ({
          ...prev,
          email: ''
        }))
        setErrors(prev => ({
          ...prev,
          email: 'Este email ya está registrado',
          general: response.data.message
        }))
        toast.error(response.data.message)
        return
      }

      queryClient.invalidateQueries({ queryKey: ['socios'] })
      const data = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'repeatPassword') {
          data.append(key, value.toString())
        }
      })
      onSubmit(data)
      onClose()
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
      setErrors(prev => ({
        ...prev,
        general: 'Error al registrar el socio'
      }))
      toast.error('Error al registrar el socio')
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({ password: '', repeatPassword: '', email: '', general: '' })
    
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

    if (name === 'password' || name === 'repeatPassword' || name === 'email') {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl border-emerald-900/20 bg-gradient-to-b from-emerald-950/50 to-emerald-900/30 backdrop-blur-xl">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-emerald-100 flex items-center text-xl">
            <div className="p-2 bg-emerald-900/50 rounded-lg mr-3">
              <UserPlus className="h-5 w-5 text-emerald-400" />
            </div>
            Agregar Nuevo Socio
          </DialogTitle>
          <DialogDescription className="text-emerald-300/80">
            Completa la información del nuevo socio del club cannábico.
          </DialogDescription>
        </DialogHeader>

        {errors.email && (
          <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-3 text-red-300 text-sm mb-4">
            <div className="flex items-center">
              <span className="mr-2">⚠️</span>
              {errors.email}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && !errors.email && (
            <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-3 text-red-300 text-sm">
              <div className="flex items-center">
                <span className="mr-2">⚠️</span>
                {errors.general}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <Label htmlFor="name" className="text-emerald-300/90 mb-2 block">
                Nombre
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" />
                <Input 
                  id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="pl-10 bg-emerald-950/50 border-emerald-800/50 text-emerald-100 placeholder:text-emerald-500/50 focus:border-emerald-500 rounded-lg" 
                  placeholder="Ingresa el nombre completo"
                />
              </div>
            </div>

            <div className="relative">
              <Label htmlFor="email" className="text-emerald-300/90 mb-2 block">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" />
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`pl-10 bg-emerald-950/50 border-emerald-800/50 text-emerald-100 placeholder:text-emerald-500/50 focus:border-emerald-500 rounded-lg ${errors.email ? 'border-red-500/50 bg-red-900/20' : ''}`}
                  placeholder={errors.email ? 'Email ya registrado' : 'ejemplo@email.com'}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Label htmlFor="password" className="text-emerald-300/90 mb-2 block">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" />
                  <Input 
                    id="password" 
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={`pl-10 bg-emerald-950/50 border-emerald-800/50 text-emerald-100 placeholder:text-emerald-500/50 focus:border-emerald-500 rounded-lg ${errors.password ? 'border-red-500/50 bg-red-900/20' : ''}`}
                    placeholder="••••••"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div className="relative">
                <Label htmlFor="repeatPassword" className="text-emerald-300/90 mb-2 block">
                  Repetir Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" />
                  <Input 
                    id="repeatPassword" 
                    name="repeatPassword"
                    type="password"
                    value={formData.repeatPassword}
                    onChange={handleChange}
                    required
                    className={`pl-10 bg-emerald-950/50 border-emerald-800/50 text-emerald-100 placeholder:text-emerald-500/50 focus:border-emerald-500 rounded-lg ${errors.repeatPassword ? 'border-red-500/50 bg-red-900/20' : ''}`}
                    placeholder="••••••"
                  />
                </div>
                {errors.repeatPassword && (
                  <p className="text-red-400 text-xs mt-1">{errors.repeatPassword}</p>
                )}
              </div>
            </div>

            <div className="relative">
              <Label htmlFor="phone" className="text-emerald-300/90 mb-2 block">
                Teléfono
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" />
                <Input 
                  id="phone" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10 bg-emerald-950/50 border-emerald-800/50 text-emerald-100 placeholder:text-emerald-500/50 focus:border-emerald-500 rounded-lg"
                  placeholder="+34 123 456 789"
                />
              </div>
            </div>

            <div className="relative">
              <Label htmlFor="address" className="text-emerald-300/90 mb-2 block">
                Dirección
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" />
                <Input 
                  id="address" 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="pl-10 bg-emerald-950/50 border-emerald-800/50 text-emerald-100 placeholder:text-emerald-500/50 focus:border-emerald-500 rounded-lg"
                  placeholder="Calle, número, ciudad"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button"
              variant="outline" 
              onClick={onClose} 
              className="border-emerald-800/50 text-green-800 hover:text-black hover:bg-gray-400 rounded-lg"
              disabled={registerMutation.isPending}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800"
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