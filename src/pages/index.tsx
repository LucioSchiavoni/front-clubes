
import {Link} from 'react-router-dom'
import LoginForm from "@/components/forms/LoginForm"

export default function IndexPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-green-900">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-b border-green-200 dark:border-green-800">
        <Link className="flex items-center justify-center" to="/">
    
          <span className="ml-2 text-2xl font-bold text-green-800 dark:text-green-200">CannabisClub</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-green-600 transition-colors" to="#features">
            Características
          </Link>
          <Link className="text-sm font-medium hover:text-green-600 transition-colors" to="#benefits">
            Beneficios
          </Link>
          <Link className="text-sm font-medium hover:text-green-600 transition-colors" to="#contact">
            Contacto
          </Link>
          <Link to="/login">
            <Button variant="outline" size="sm" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
              Iniciar Sesión
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                    Plataforma Integral de Gestión
                  </Badge>
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-green-900 dark:text-green-100">
                    Gestiona tu Club Cannábico de forma{" "}
                    <span className="text-green-600">Profesional</span>
                  </h1>
                  <p className="max-w-[600px] text-gray-600 dark:text-gray-300 md:text-xl">
                    La plataforma completa para administrar productos, socios y reservas de tu club cannábico. 
                    Simplifica la gestión y mejora la experiencia de tus miembros.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Link to="/login">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                      Comenzar Ahora
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50">
                    Ver Demo
                  </Button>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur-3xl opacity-20"></div>
                  <img
                    src="/placeholder.svg?height=500&width=500"
                    width="500"
                    height="500"
                    alt="Dashboard Preview"
                    className="relative rounded-2xl shadow-2xl border border-green-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-green-900 dark:text-green-100">
                  Características Principales
                </h2>
                <p className="max-w-[900px] text-gray-600 dark:text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Todo lo que necesitas para gestionar tu club cannábico de manera eficiente y profesional.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card className="border-green-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Package className="h-12 w-12 text-green-600 mb-4" />
                  <CardTitle className="text-green-900 dark:text-green-100">Gestión de Productos</CardTitle>
                  <CardDescription>
                    Administra tu inventario de productos cannábicos con control de stock, precios y disponibilidad.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Control de inventario en tiempo real
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Categorización de productos
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Gestión de precios y ofertas
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Users className="h-12 w-12 text-green-600 mb-4" />
                  <CardTitle className="text-green-900 dark:text-green-100">Administración de Socios</CardTitle>
                  <CardDescription>
                    Gestiona la membresía de tu club con perfiles completos y control de acceso.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Perfiles detallados de miembros
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Control de membresías y cuotas
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Historial de actividad
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Calendar className="h-12 w-12 text-green-600 mb-4" />
                  <CardTitle className="text-green-900 dark:text-green-100">Sistema de Reservas</CardTitle>
                  <CardDescription>
                    Permite a los socios reservar productos de forma fácil y organizada.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Reservas online 24/7
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Notificaciones automáticas
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Calendario de disponibilidad
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-green-600 to-emerald-600">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                  ¿Por qué elegir CannabisClub?
                </h2>
                <p className="max-w-[900px] text-green-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Beneficios que transformarán la gestión de tu club cannábico.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col space-y-6">
                <div className="flex items-start space-x-4">
                  <Shield className="h-8 w-8 text-green-200 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-white">Cumplimiento Legal</h3>
                    <p className="text-green-100">
                      Mantén registros detallados y cumple con todas las regulaciones locales.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <BarChart3 className="h-8 w-8 text-green-200 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-white">Análisis y Reportes</h3>
                    <p className="text-green-100">
                      Obtén insights valiosos sobre ventas, inventario y comportamiento de socios.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Clock className="h-8 w-8 text-green-200 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-white">Ahorro de Tiempo</h3>
                    <p className="text-green-100">
                      Automatiza procesos repetitivos y enfócate en hacer crecer tu club.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  width="400"
                  height="400"
                  alt="Benefits Illustration"
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-green-900 dark:text-green-100">
                  ¿Listo para transformar tu club?
                </h2>
                <p className="max-w-[600px] text-gray-600 dark:text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Únete a los clubes cannábicos que ya están utilizando nuestra plataforma para mejorar su gestión.
                </p>
              </div>
              <div className="space-x-4">
                <Link to="/login">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                    Comenzar Gratis
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50">
                  Contactar Ventas
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-green-200 bg-green-50 dark:bg-gray-900 dark:border-green-800">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          © 2024 CannabisClub. Todos los derechos reservados.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-gray-600 dark:text-gray-400" to="#">
            Términos de Servicio
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-600 dark:text-gray-400" to="#">
            Privacidad
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-600 dark:text-gray-400" to="#">
            Contacto
          </Link>
        </nav>
      </footer>
    </div>
  )
}
