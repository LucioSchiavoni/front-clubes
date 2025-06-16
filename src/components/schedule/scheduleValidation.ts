import { z } from "zod"

export const validateTimeRange = (startTime: string, endTime: string) => {
  if (!startTime || !endTime) return true
  return new Date(`2000-01-01T${endTime}`) > new Date(`2000-01-01T${startTime}`)
}

export const validateScheduleOverlap = (schedules: any[]) => {
  for (let i = 0; i < schedules.length; i++) {
    for (let j = i + 1; j < schedules.length; j++) {
      if (schedules[i].dayOfWeek === schedules[j].dayOfWeek) {
        const start1 = new Date(`2000-01-01T${schedules[i].startTime}`)
        const end1 = new Date(`2000-01-01T${schedules[i].endTime}`)
        const start2 = new Date(`2000-01-01T${schedules[j].startTime}`)
        const end2 = new Date(`2000-01-01T${schedules[j].endTime}`)

        if ((start1 <= end2 && end1 >= start2) || (start2 <= end1 && end2 >= start1)) {
          return false
        }
      }
    }
  }
  return true
}

export const formSchema = z.object({
  schedules: z
    .array(
      z.object({
        dayOfWeek: z.string().min(1, "El día es requerido"),
        startTime: z
          .string()
          .min(1, "La hora de inicio es requerida")
          .refine((time) => {
            const hour = Number.parseInt(time.split(":")[0])
            return hour >= 8 && hour <= 16
          }, "El horario debe estar entre las 8:00 y las 16:00"),
        endTime: z
          .string()
          .min(1, "La hora de fin es requerida")
          .refine((time) => {
            const hour = Number.parseInt(time.split(":")[0])
            return hour >= 8 && hour <= 16
          }, "El horario debe estar entre las 8:00 y las 16:00"),
        maxCapacity: z
          .string()
          .min(1, "La capacidad máxima es requerida")
          .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: "La capacidad debe ser un número mayor a 0",
          }),
      }),
    )
    .min(1, "Debes agregar al menos un horario")
    .refine((schedules) => {
      const days = schedules.map((s) => s.dayOfWeek)
      return new Set(days).size === days.length
    }, "No puedes tener dos horarios para el mismo día")
    .refine((schedules) => {
      return validateScheduleOverlap(schedules)
    }, "Los horarios no pueden superponerse")
    .refine((schedules) => {
      return schedules.every((schedule) => validateTimeRange(schedule.startTime, schedule.endTime))
    }, "La hora de fin debe ser posterior a la hora de inicio"),
})

export type FormValues = z.infer<typeof formSchema>