import { ChevronLeft, ChevronRight, Clock, Users, Calendar, CheckCircle, Trash2, ChevronUp, ChevronDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { daysOfWeek, timeSlots, capacityOptions } from "@/components/schedule/scheduleConfig"
import { FormValues } from "@/components/schedule/scheduleValidation"
import { UseFormReturn, UseFieldArrayReturn } from "react-hook-form"

interface ScheduleCarouselProps {
  form: UseFormReturn<FormValues>
  fields: UseFieldArrayReturn<FormValues, "schedules", "id">["fields"]
  currentScheduleIndex: number
  currentStep: { index: number; field: string } | null
  expandedFields: { [key: string]: boolean }
  firstRender: { [key: string]: boolean }
  handlePrevSchedule: () => void
  handleNextSchedule: () => void
  handleFieldComplete: (field: string, index: number) => void
  handleTimeSelect: (time: string, field: 'startTime' | 'endTime', index: number) => void
  toggleField: (field: string) => void
  remove: (index: number) => void
  append: (value: any) => void
  setCurrentScheduleIndex: (value: number) => void
}

export function ScheduleCarousel({
  form,
  fields,
  currentScheduleIndex,
  currentStep,
  expandedFields,
  firstRender,
  handlePrevSchedule,
  handleNextSchedule,
  handleFieldComplete,
  handleTimeSelect,
  toggleField,
  remove,
  append,
  setCurrentScheduleIndex,
}: ScheduleCarouselProps) {
  return (
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
              const currentSchedule = form.watch(`schedules.${currentScheduleIndex}`)
              const day = daysOfWeek.find(d => d.value === currentSchedule.dayOfWeek)
              const startTime = timeSlots.find(t => t.value === currentSchedule.startTime)
              const endTime = timeSlots.find(t => t.value === currentSchedule.endTime)
              const capacity = capacityOptions.find(c => c.value === currentSchedule.maxCapacity)

              if (day && startTime && endTime && capacity) {
                return (
                  <div className="flex flex-col items-center justify-center gap-1">
                    <h4 className="text-xl font-semibold text-primary">
                      {day.label}
                    </h4>
                    <div className="flex items-center gap-2 text-base font-medium text-foreground">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{startTime.label} - {endTime.label}</span>
                      <Users className="h-4 w-4 text-primary" />
                      <span>{capacity.label}</span>
                    </div>
                  </div>
                )
              }
              return (
                <div className="text-base font-semibold text-muted-foreground">
                  Complete la configuración del horario
                </div>
              )
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
              const watchedValues = form.watch(`schedules.${index}`)
              const isComplete = watchedValues.dayOfWeek && watchedValues.startTime && watchedValues.endTime && watchedValues.maxCapacity

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
                              remove(index)
                              if (currentScheduleIndex >= fields.length - 1) {
                                setCurrentScheduleIndex(fields.length - 2)
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
                            {daysOfWeek.find(d => d.value === watchedValues.dayOfWeek)?.label}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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
                                {capacityOptions.find(c => c.value === watchedValues.maxCapacity)?.label}
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
          append({ dayOfWeek: "", startTime: "", endTime: "", maxCapacity: "" })
          setCurrentScheduleIndex(fields.length)
        }}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Agregar Horario
      </Button>
    </div>
  )
} 