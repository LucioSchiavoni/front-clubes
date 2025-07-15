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

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const setToken = useAuthStore((state) => state.setToken)
  const setProfile = useAuthStore((state) => state.setProfile)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    loginMutation.mutate({ email, password })
  }

  return (
    <div className="flex items-center justify-center  text-club-green px-4">
      <Card className="bg-white border border-club-light shadow-xl rounded-xl p-8 max-w-md w-full">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-club-green text-start flex font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-club-green h-5 w-5" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 bg-white border border-club-light text-club-dark placeholder:text-club-light focus:border-club-green focus:ring-club-green h-12 text-lg rounded-md"
                  placeholder="tu@email.com"
                  required
                />
              </div>
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 bg-white border border-club-light text-club-dark placeholder:text-club-light focus:border-club-green focus:ring-club-green h-12 text-lg rounded-md"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-club-green hover:text-club-greenHover"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <Alert className="bg-club-greenHover/10 border border-club-green text-club-greenHover">
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
