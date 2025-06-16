import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface ScheduleActionsProps {
  isLoading: boolean
  hasExistingSchedules: boolean
  onCancel: () => void
}

export function ScheduleActions({
  isLoading,
  hasExistingSchedules,
  onCancel
}: ScheduleActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="flex-1"
        disabled={isLoading}
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        className="flex-1"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {hasExistingSchedules ? "Actualizando..." : "Creando..."}
          </>
        ) : (
          hasExistingSchedules ? "Actualizar Horarios" : "Crear Horarios"
        )}
      </Button>
    </div>
  )
} 