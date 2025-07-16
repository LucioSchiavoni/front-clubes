"use client"

import { useAuthStore } from "@/store/auth"
import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginRequest, authRequest } from "@/api/auth"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { useForm } from "react-hook-form"

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const setToken = useAuthStore((state) => state.setToken)
  const setProfile = useAuthStore((state) => state.setProfile)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
    clearErrors,
  } = useForm<{ email: string; password: string }>({
    
  })

  const loginMutation = useMutation<any, any, { email: string; password: string }>({
    mutationFn: loginRequest,
    onSuccess: async (data: any) => {
      try {
        if (data.success) {
          const token = data.data.token
          if (!token) {
            setError("No se recibió el token de autenticación")
            return
          }
          setToken(token)
          const isAuth = await authRequest()

          if (isAuth.data.success) {
            setProfile(isAuth.data)
            navigate("/dashboard")
          } else {
            setError("Error al obtener el perfil del usuario")
          }
        } else {
          setError("Credenciales incorrectas")
        }
      } catch (error) {
        setError("Error en el proceso de autenticación")
      }
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Error de servidor")
    },
  })

  const onSubmit = (data: { email: string; password: string }) => {
    setError(null)
    loginMutation.mutate(data)
  }

  return (
    <div className="flex items-center justify-center  text-club-green px-4">
      <Card className="bg-transparent backdrop-blur-md border border-cl  shadow-xl rounded-xl p-8 max-w-md w-full">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-club-green text-start flex font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-club-green h-5 w-5" />
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "El email es obligatorio",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Email inválido",
                    },
                  })}
                  className="pl-12 bg-white border border-club-light text-club-light placeholder:text-gray-500 focus:border-club-green focus:ring-club-green h-12 text-lg rounded-md bg-transparent backdrop-blur-2xl"
                  placeholder="ejemplo@email.com"
                />
              </div>
              {errors.email && (
                <Alert className="bg-club-greenHover/10 border border-club-green text-club-greenHover mt-1">
                  <AlertDescription>{errors.email.message}</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-club-green text-start flex font-medium">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-club-green h-5 w-5" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                    minLength: {
                      value: 6,
                      message: "La contraseña debe tener al menos 6 caracteres",
                    },
                  })}
                  className="pl-12 pr-12   border text-club-light border-club-light dark:text-club-dark placeholder:text-gray-400 focus:border-club-green focus:ring-club-green h-12 text-lg rounded-md "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-club-green hover:text-club-greenHover"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <Alert className="bg-club-greenHover/10 border border-club-green text-club-greenHover mt-1">
                  <AlertDescription>{errors.password.message}</AlertDescription>
                </Alert>
              )}
            </div>

            {error && (
              <Alert className="bg-transparent border text-white border-yellow-600 ">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-club-green text-white font-semibold hover:bg-club-greenHover transition-all duration-300 h-12 text-lg rounded-md"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Iniciando sesión..." : "Acceder al Club"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginForm
