
import {Link} from 'react-router-dom'
import LoginForm from "@/components/forms/LoginForm"

export default function IndexPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-green-900">
      <main className="flex-1">
      <LoginForm/>
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
