import { useState } from "react"
import {
  Loader2,
  Users,
  Filter,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import AddSocioForm from "./AddSocioForm"

interface Socio {
  id: string
  name: string
  active: boolean
  createdAt: string
}

interface SocioListProps {
  socios: Socio[]
  isLoading: boolean
  onAddMember: (formData: FormData) => Promise<void>
}

const SocioList = ({ socios, isLoading, onAddMember }: SocioListProps) => {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Socios</h3>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-green-600" />
              <span className="ml-2 text-sm">Cargando...</span>
            </div>
          ) : socios.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-muted-foreground">No hay socios registrados</p>
            </div>
          ) : (
            socios.map((socio, index) => (
              <div
                key={socio.id}
                className="flex items-center space-x-3 p-3 rounded-lg  transition-colors hover:bg-slate-900"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="text-sm text-muted-foreground w-6 flex-shrink-0">{index + 1}</div>
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="bg-green-300 text-green-800 text-xs">
                      {socio.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm  font-medium truncate capitalize">{socio.name}</p>
                    <div className="flex items-center space-x-1 ">
                    
                      <span className="text-xs text-muted-foreground text-gray-300"> </span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-medium">
                    {socio.active ? (
                      <span className="text-green-600">Activo</span>
                    ) : (
                      <span className="text-red-600">Inactivo</span>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    {socio.active ? (
                      <ArrowUp className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                    ) : (
                      <ArrowDown className="h-3 w-3 text-red-500 mr-1 flex-shrink-0" />
                    )}
                    {new Date(socio.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AddSocioForm 
        isOpen={isAddMemberOpen} 
        onClose={() => setIsAddMemberOpen(false)} 
        onSubmit={onAddMember} 
      />
    </div>
  )
}

export default SocioList