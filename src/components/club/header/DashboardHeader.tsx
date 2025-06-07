import { Leaf, Search, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeSwitch } from "@/components/theme-switch"

interface DashboardHeaderProps {
  clubName: string
  searchTerm: string
  onSearchChange: (value: string) => void
  onAddMember: () => void
}

const DashboardHeader = ({ clubName, searchTerm, onSearchChange, onAddMember }: DashboardHeaderProps) => {
  return (
    <div className="border-b  backdrop-blur-sm sticky top-0 z-40">
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 w-full sm:w-auto">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-green-800 to-emerald-800 rounded-xl">
              <Leaf className="h-6 w-6 text-white" />
            </div>
          </div>

          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar socios, productos..."
              className="pl-10 w-full sm:w-[400px] bg-slate-900 border-slate-800 text-slate-100"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="hidden sm:block">
            <ThemeSwitch />
          </div>
          <Button
            onClick={onAddMember}
            className="bg-green-800 hover:bg-green-900 text-white flex-1 sm:flex-none"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Agregar Socio</span>
            <span className="sm:hidden">Agregar Socio</span>
          </Button>
          <div className="flex items-center space-x-2">
            <div className="sm:hidden">
              <ThemeSwitch />
            </div>
            <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
              <span className="text-slate-100 font-semibold">A</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardHeader 