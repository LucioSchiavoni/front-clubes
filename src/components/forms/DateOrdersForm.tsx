"use client"

import { useState, useRef, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { createSchedules, getSchedules } from "@/api/clubDate"
import { Plus, Trash2, AlertCircle, Clock, Users, Calendar, CheckCircle, ArrowRight, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useParams } from "react-router-dom"
import { useToast } from "../../hooks/use-toast"

const daysOfWeek = [
  { value: "1", label: "Lunes", color: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200" },
  { value: "2", label: "Martes", color: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200" },
  { value: "3", label: "Miércoles", color: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200" },
  { value: "4", label: "Jueves", color: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200" },
  { value: "5", label: "Viernes", color: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200" },
  { value: "6", label: "Sábado", color: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200" },
  { value: "7", label: "Domingo", color: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200" },
]

const timeSlots = [
  { value: "08:00", label: "08:00 AM", desc: "Apertura temprana" },
  { value: "09:00", label: "09:00 AM", desc: "Horario matutino" },
  { value: "10:00", label: "10:00 AM", desc: "Media mañana" },
  { value: "11:00", label: "11:00 AM", desc: "Horario activo" },
  { value: "12:00", label: "12:00 PM", desc: "Mediodía" },
  { value: "13:00", label: "01:00 PM", desc: "Tarde temprana" },
  { value: "14:00", label: "02:00 PM", desc: "Tarde activa" },
  { value: "15:00", label: "03:00 PM", desc: "Tarde" },
  { value: "16:00", label: "04:00 PM", desc: "Cierre" },
]

const capacityOptions = [
  { value: "5", label: "5 personas", desc: "Grupo pequeño" },
  { value: "10", label: "10 personas", desc: "Grupo mediano" },
  { value: "15", label: "15 personas", desc: "Grupo grande" },
  { value: "20", label: "20 personas", desc: "Capacidad alta" },
  { value: "25", label: "25 personas", desc: "Capacidad máxima" },
]

// Validaciones (mantener las mismas del código original)
const validateTimeRange = (startTime: string, endTime: string) => {
  if (!startTime || !endTime) return true
  return new Date(`2000-01-01T${endTime}`) > new Date(`2000-01-01T${startTime}`)
}

const validateScheduleOverlap = (schedules: any[]) => {
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

const formSchema = z.object({
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

type FormValues = z.infer<typeof formSchema>

interface ScheduleFormProps {
  clubId: string
}

export default function ScheduleForm({ clubId }: ScheduleFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [currentStep, setCurrentStep] = useState<{ index: number; field: string } | null>(null)
  const [expandedFields, setExpandedFields] = useState<{ [key: string]: boolean }>({})
  const [firstRender, setFirstRender] = useState<{ [key: string]: boolean }>({})
  const queryClient = useQueryClient()
  const formRef = useRef<HTMLDivElement>(null)
  const [currentScheduleIndex, setCurrentScheduleIndex] = useState(0);

  // Cargar horarios existentes
  const { data: existingSchedules } = useQuery({
    queryKey: ['schedules', clubId],
    queryFn: () => getSchedules(clubId),
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schedules: [
        {
          dayOfWeek: "",
          startTime: "",
          endTime: "",
          maxCapacity: "",
        },
      ],
    },
  })

  // Cargar horarios existentes en el formulario
  useEffect(() => {
    if (existingSchedules?.data?.data && existingSchedules.data.data.length > 0) {
      const formattedSchedules = existingSchedules.data.data.map((schedule: any) => ({
        dayOfWeek: schedule.dayOfWeek.toString(),
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        maxCapacity: schedule.maxCapacity.toString(),
      }));

      form.reset({ schedules: formattedSchedules });
    }
  }, [existingSchedules, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "schedules",
  })

  const scrollToField = (index: number, field: string) => {
    setTimeout(() => {
      const element = document.getElementById(`schedule-${index}-${field}`)
      if (element) {
        // Calcular la posición del elemento
        const elementRect = element.getBoundingClientRect()
        const absoluteElementTop = elementRect.top + window.pageYOffset
        const middle = absoluteElementTop - (window.innerHeight / 2)
        
        // Scroll suave a la posición
        window.scrollTo({
          top: middle,
          behavior: "smooth"
        })
        
        setCurrentStep({ index, field })
      }
    }, 100)
  }

  const handleFieldComplete = (field: string, index: number) => {
    // Limpiar el error al cambiar de campo
    setError(null);
    
    const nextField = getNextField(field);
    if (nextField) {
      setCurrentStep({ index, field: nextField });
      setExpandedFields(prev => ({
        ...prev,
        [`${nextField}-${index}`]: true
      }));
      setFirstRender(prev => ({
        ...prev,
        [`${nextField}-${index}`]: true
      }));
    }
  };

  const handleTimeSelect = (time: string, field: 'startTime' | 'endTime', index: number) => {
    // Limpiar el error al seleccionar un tiempo
    setError(null);
    
    form.setValue(`schedules.${index}.${field}`, time);
    setExpandedFields(prev => ({
      ...prev,
      [`${field}-${index}`]: false
    }));
    setFirstRender(prev => ({
      ...prev,
      [`${field}-${index}`]: false
    }));
    handleFieldComplete(field, index);
  };

  const getNextField = (currentField: string): string | null => {
    const fieldOrder = ["dayOfWeek", "startTime", "endTime", "maxCapacity"]
    const currentIndex = fieldOrder.indexOf(currentField)
    return currentIndex < fieldOrder.length - 1 ? fieldOrder[currentIndex + 1] : null
  }

  const createSchedulesMutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => {
      if (!data.schedules || data.schedules.length === 0) {
        throw new Error("Debe agregar al menos un horario")
      }

      const formattedSchedules = data.schedules.map((schedule) => {
        const dayOfWeek = Number.parseInt(schedule.dayOfWeek.toString())
        const maxCapacity = Number.parseInt(schedule.maxCapacity.toString())

        if (isNaN(dayOfWeek) || isNaN(maxCapacity)) {
          throw new Error("Los valores de día y capacidad deben ser números válidos")
        }

        return {
          dayOfWeek,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          maxCapacity,
        }
      })

      const dataToSend = {
        schedules: formattedSchedules,
      }

      return createSchedules(clubId, dataToSend)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules", clubId] })
      setShowSuccessAlert(true)
      form.reset()
      setError(null)
      setCurrentStep(null)
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || "Error al crear los horarios"
      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: errorMessage,
        duration: 5000
      })
    },
    onSettled: () => {
      setIsSubmitting(false)
    },
  })

  // Efecto para ocultar la alerta de éxito después de 3 segundos
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (showSuccessAlert) {
      timeoutId = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showSuccessAlert]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      setError(null);
      form.clearErrors(); // Limpiar errores del formulario

      const schedulesToSubmit = data.schedules.filter(schedule => 
        schedule && 
        schedule.dayOfWeek && 
        schedule.startTime && 
        schedule.endTime && 
        schedule.maxCapacity
      );

      if (schedulesToSubmit.length === 0) {
        setError("Debes configurar al menos un horario");
        return;
      }

      const response = await createSchedulesMutation.mutateAsync(data);

      if (response.data?.error) {
        setError(response.data.error);
        return;
      }

      toast({
        title: "Horarios actualizados",
        description: "La configuración de horarios se ha guardado correctamente.",
      });

      form.reset({
        schedules: schedulesToSubmit
      });

    } catch (error: any) {
      setError(error.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedDay = (value: string) => {
    return daysOfWeek.find((day) => day.value === value)
  }

  const getSelectedTime = (value: string) => {
    return timeSlots.find((time) => time.value === value)
  }

  const getSelectedCapacity = (value: string) => {
    return capacityOptions.find((cap) => cap.value === value)
  }

  const toggleField = (field: string) => {
    setExpandedFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
    // Limpiar el estado de primera vez cuando se togglea manualmente
    setFirstRender(prev => ({
      ...prev,
      [field]: false
    }));
  }

  const handleNextSchedule = () => {
    if (currentScheduleIndex < fields.length - 1) {
      setCurrentScheduleIndex(prev => prev + 1);
    }
  };

  const handlePrevSchedule = () => {
    if (currentScheduleIndex > 0) {
      setCurrentScheduleIndex(prev => prev - 1);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6" ref={formRef}>
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in-up">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-secondary dark:bg-secondary/30 rounded-full flex items-center justify-center">
            <Calendar className="h-8 w-8 text-primary dark:text-primary" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Configuración de Horarios</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
          {existingSchedules?.data?.data?.length 
            ? "Modifica los horarios de dispensación para tu club cannábico"
            : "Configure los horarios de dispensación para su club cannábico"}
        </p>
        <Badge variant="outline" className="px-4 py-2 text-sm bg-background">
          <Clock className="h-4 w-4 mr-2 text-primary" />
          Horario permitido: 08:00 - 16:00
        </Badge>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Horarios</CardTitle>
            <CardDescription>
              Establece los horarios disponibles para cada día de la semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Carrusel de Horarios */}
              <div className="relative">
                {/* Navegación */}
                <div className="flex items-center justify-between mb-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevSchedule}
                    disabled={currentScheduleIndex === 0}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 text-center">
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Horario {currentScheduleIndex + 1} de {fields.length}
                    </div>
                    {(() => {
                      const currentSchedule = form.watch(`schedules.${currentScheduleIndex}`);
                      const day = daysOfWeek.find(d => d.value === currentSchedule.dayOfWeek);
                      const startTime = timeSlots.find(t => t.value === currentSchedule.startTime);
                      const endTime = timeSlots.find(t => t.value === currentSchedule.endTime);
                      const capacity = capacityOptions.find(c => c.value === currentSchedule.maxCapacity);

                      if (day && startTime && endTime && capacity) {
                        return (
                          <div className="flex items-center justify-center gap-2 text-base font-semibold text-primary">
                            <span>{day.label}</span>
                            <Clock className="h-4 w-4" />
                            <span>{startTime.label} - {endTime.label}</span>
                            <Users className="h-4 w-4" />
                            <span>{capacity.label}</span>
                          </div>
                        );
                      }
                      return (
                        <div className="text-base font-semibold text-muted-foreground">
                          Complete la configuración del horario
                        </div>
                      );
                    })()}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleNextSchedule}
                    disabled={currentScheduleIndex === fields.length - 1}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Contenido del Carrusel */}
                <div className="relative overflow-hidden">
                  <div 
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${currentScheduleIndex * 100}%)` }}
                  >
                    {fields.map((field, index) => {
                      const watchedValues = form.watch(`schedules.${index}`);
                      const isComplete = watchedValues.dayOfWeek && watchedValues.startTime && watchedValues.endTime && watchedValues.maxCapacity;

                      return (
                        <div 
                          key={field.id} 
                          className="w-full flex-shrink-0 px-1"
                          style={{ width: '100%' }}
                        >
                          <Card
                            className={`transition-all duration-300 ${
                              isComplete
                                ? "border-primary/20 bg-primary/5"
                                : "border-border bg-card"
                            } ${currentStep?.index === index ? "ring-2 ring-primary/20" : ""}`}
                          >
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="text-sm font-medium text-muted-foreground">
                                    Horario {index + 1}
                                  </div>
                                </div>
                                {index > 0 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      remove(index);
                                      if (currentScheduleIndex >= fields.length - 1) {
                                        setCurrentScheduleIndex(fields.length - 2);
                                      }
                                    }}
                                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Eliminar horario
                                  </Button>
                                )}
                              </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                              {/* Day Selection */}
                              <div id={`schedule-${index}-dayOfWeek`} className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                                  <Calendar className="h-4 w-4 text-primary" />
                                  Día de la semana
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                                  {daysOfWeek.map((day) => {
                                    const isSelected = watchedValues.dayOfWeek === day.value
                                    return (
                                      <button
                                        key={day.value}
                                        type="button"
                                        onClick={() => {
                                          form.setValue(`schedules.${index}.dayOfWeek`, day.value)
                                          handleFieldComplete("dayOfWeek", index)
                                        }}
                                        className={`p-3 rounded-lg border transition-all duration-200 text-sm font-medium ${
                                          isSelected
                                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                            : "border-border hover:border-primary/50 bg-card text-card-foreground"
                                        }`}
                                      >
                                        {day.label}
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>

                              {/* Start Time */}
                              {watchedValues.dayOfWeek && (
                                <div id={`schedule-${index}-startTime`} className="space-y-3 animate-slide-in">
                                  <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                                      <Clock className="h-4 w-4 text-primary" />
                                      Hora de inicio
                                    </label>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleField(`startTime-${index}`)}
                                      className="text-muted-foreground hover:text-primary p-1 h-8 w-8"
                                    >
                                      {expandedFields[`startTime-${index}`] ? (
                                        <ChevronUp className="h-4 w-4" />
                                      ) : (
                                        <ChevronDown className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                  {watchedValues.startTime && (
                                    <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg">
                                      <Clock className="h-4 w-4 text-primary" />
                                      <span className="font-medium">{timeSlots.find(t => t.value === watchedValues.startTime)?.label}</span>
                                    </div>
                                  )}
                                  {(expandedFields[`startTime-${index}`] || firstRender[`startTime-${index}`]) && (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 mt-2">
                                      {timeSlots.map((time) => (
                                        <Button
                                          key={time.value}
                                          type="button"
                                          variant={watchedValues.startTime === time.value ? "default" : "outline"}
                                          className="h-8 text-xs sm:text-sm"
                                          onClick={() => handleTimeSelect(time.value, 'startTime', index)}
                                        >
                                          {time.label}
                                        </Button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* End Time */}
                              {watchedValues.startTime && (
                                <div id={`schedule-${index}-endTime`} className="space-y-3 animate-slide-in">
                                  <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                                      <Clock className="h-4 w-4 text-primary" />
                                      Hora de finalización
                                    </label>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleField(`endTime-${index}`)}
                                      className="text-muted-foreground hover:text-primary p-1 h-8 w-8"
                                    >
                                      {expandedFields[`endTime-${index}`] ? (
                                        <ChevronUp className="h-4 w-4" />
                                      ) : (
                                        <ChevronDown className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                  {watchedValues.endTime && (
                                    <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg">
                                      <Clock className="h-4 w-4 text-primary" />
                                      <span className="font-medium">{timeSlots.find(t => t.value === watchedValues.endTime)?.label}</span>
                                    </div>
                                  )}
                                  {(expandedFields[`endTime-${index}`] || firstRender[`endTime-${index}`]) && (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 mt-2">
                                      {timeSlots
                                        .filter((time) => time.value > watchedValues.startTime)
                                        .map((time) => (
                                          <Button
                                            key={time.value}
                                            type="button"
                                            variant={watchedValues.endTime === time.value ? "default" : "outline"}
                                            className="h-8 text-xs sm:text-sm"
                                            onClick={() => handleTimeSelect(time.value, 'endTime', index)}
                                          >
                                            {time.label}
                                          </Button>
                                        ))}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Capacity */}
                              {watchedValues.endTime && (
                                <div id={`schedule-${index}-maxCapacity`} className="space-y-3 animate-slide-in">
                                  <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                                    <Users className="h-4 w-4 text-primary" />
                                    Capacidad máxima
                                  </label>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                                    {capacityOptions.map((capacity) => {
                                      const isSelected = watchedValues.maxCapacity === capacity.value
                                      return (
                                        <button
                                          key={capacity.value}
                                          type="button"
                                          onClick={() => {
                                            form.setValue(`schedules.${index}.maxCapacity`, capacity.value)
                                            handleFieldComplete("maxCapacity", index)
                                          }}
                                          className={`p-3 rounded-lg border transition-all duration-200 text-sm font-medium ${
                                            isSelected
                                              ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                              : "border-border hover:border-primary/50 bg-card text-card-foreground"
                                          }`}
                                        >
                                          <div className="font-semibold">{capacity.label}</div>
                                          <div className="text-xs text-muted-foreground">{capacity.desc}</div>
                                        </button>
                                      )
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Summary */}
                              {isComplete && (
                                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20 animate-fade-in">
                                  <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5" />
                                    Resumen de configuración
                                  </h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                    <div>
                                      <span className="text-primary font-medium">Día:</span>
                                      <div className="font-semibold text-foreground">
                                        {getSelectedDay(watchedValues.dayOfWeek)?.label}
                                      </div>
                                    </div>
                                    <div>
                                      <span className="text-primary font-medium">Horario:</span>
                                      <div className="font-semibold text-foreground">
                                        {timeSlots.find(t => t.value === watchedValues.startTime)?.label} -{" "}
                                        {timeSlots.find(t => t.value === watchedValues.endTime)?.label}
                                      </div>
                                    </div>
                                    <div>
                                      <span className="text-primary font-medium">Capacidad:</span>
                                      <div className="font-semibold text-foreground">
                                        {getSelectedCapacity(watchedValues.maxCapacity)?.label}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Indicadores de Navegación */}
                <div className="flex justify-center gap-2 mt-4">
                  {fields.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentScheduleIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentScheduleIndex
                          ? "bg-primary w-4"
                          : "bg-border hover:bg-primary/50"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Botón Agregar Horario */}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  append({ dayOfWeek: "", startTime: "", endTime: "", maxCapacity: "" });
                  setCurrentScheduleIndex(fields.length);
                }}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Horario
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alertas de Error */}
        {(error || Object.keys(form.formState.errors).length > 0) && (
          <Card className="border-destructive/20">
            <CardContent className="p-4">
              <div className="space-y-4">
                {error && (
                  <div className="flex items-start gap-2 p-4 bg-destructive/10 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-lg font-medium text-destructive">
                        {error}
                      </p>
                    </div>
                  </div>
                )}
                {form.formState.errors.schedules && (
                  <>
                    {typeof form.formState.errors.schedules === 'object' && !Array.isArray(form.formState.errors.schedules) && (
                      <div className="flex items-start gap-2 p-4 bg-destructive/10 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-lg font-medium text-destructive">
                            {form.formState.errors.schedules.message}
                          </p>
                        </div>
                      </div>
                    )}
                    {Array.isArray(form.formState.errors.schedules) && form.formState.errors.schedules.map((scheduleError, index) => {
                      if (scheduleError) {
                        const schedule = form.watch(`schedules.${index}`);
                        const dayLabel = daysOfWeek.find(d => d.value === schedule.dayOfWeek)?.label || 'Horario';
                        
                        return Object.entries(scheduleError).map(([field, error]: [string, any]) => {
                          let errorMessage = '';
                          switch(field) {
                            case 'dayOfWeek':
                              errorMessage = 'Debes seleccionar un día de la semana';
                              break;
                            case 'startTime':
                              errorMessage = 'Debes seleccionar una hora de inicio';
                              break;
                            case 'endTime':
                              errorMessage = 'Debes seleccionar una hora de finalización';
                              break;
                            case 'maxCapacity':
                              errorMessage = 'Debes seleccionar una capacidad máxima';
                              break;
                            default:
                              errorMessage = error.message || 'Error de validación';
                          }
                          
                          return (
                            <div key={`${index}-${field}`} className="flex items-start gap-2 p-4 bg-destructive/10 rounded-lg">
                              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-lg font-medium text-destructive">
                                  {dayLabel} - {errorMessage}
                                </p>
                              </div>
                            </div>
                          );
                        });
                      }
                      return null;
                    })}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alerta de Éxito */}
        {showSuccessAlert && (
          <Card className="border-green-80">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-lg font-medium text-green-700">
                    Los horarios se han guardado correctamente
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Configuración"}
          </Button>
        </div>
      </form>
    </div>
  )
}
