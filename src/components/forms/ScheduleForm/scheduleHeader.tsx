import { Calendar, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ScheduleHeaderProps {
  hasExistingSchedules: boolean
}

export function ScheduleHeader({ hasExistingSchedules }: ScheduleHeaderProps) {
  return (
    <div className="text-center mb-8 animate-fade-in-up">
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 bg-secondary dark:bg-secondary/30 rounded-full flex items-center justify-center">
          <Calendar className="h-8 w-8 text-primary dark:text-primary" />
        </div>
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Configuración de Horarios</h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
        {hasExistingSchedules 
          ? "Modifica los horarios de dispensación para tu club cannábico"
          : "Configure los horarios de dispensación para su club cannábico"}
      </p>
      <Badge variant="outline" className="px-4 py-2 text-sm bg-background">
        <Clock className="h-4 w-4 mr-2 text-primary" />
        Horario permitido: 08:00 - 16:00
      </Badge>
    </div>
  )
} 