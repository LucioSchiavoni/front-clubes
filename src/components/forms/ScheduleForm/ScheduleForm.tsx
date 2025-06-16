import { useState, useRef, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient, useQuery } from "@tanstack/react-query"
import { createSchedules, getSchedules } from "@/api/clubDate"
import { useToast } from "../../../hooks/use-toast"
import { formSchema, FormValues } from "@/components/schedule/scheduleValidation"
import { useNavigate } from "react-router-dom"
import { ScheduleHeader } from "./scheduleHeader"
import { ScheduleCarousel } from "./scheduleCarousel"
import { ScheduleActions } from "./scheduleActions"

interface ScheduleFormProps {
  clubId: string
}

export default function ScheduleForm({ clubId }: ScheduleFormProps) {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [hasExistingSchedules, setHasExistingSchedules] = useState(false)
  const [currentScheduleIndex, setCurrentScheduleIndex] = useState(0)
  const [currentStep, setCurrentStep] = useState<{ index: number; field: string } | null>(null)
  const [expandedFields, setExpandedFields] = useState<{ [key: string]: boolean }>({})
  const [firstRender, setFirstRender] = useState<{ [key: string]: boolean }>({
    'startTime-0': true,
    'endTime-0': true
  })
  const queryClient = useQueryClient()
  const formRef = useRef<HTMLDivElement>(null)

  // Cargar horarios existentes
  const { data: existingSchedules } = useQuery({
    queryKey: ['schedules', clubId],
    queryFn: () => getSchedules(clubId),
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schedules: [{ dayOfWeek: "", startTime: "", endTime: "", maxCapacity: "" }]
    }
  })

  // Cargar horarios existentes en el formulario
  useEffect(() => {
    if (existingSchedules?.data?.data && existingSchedules.data.data.length > 0) {
      setHasExistingSchedules(true)
      form.reset({ schedules: existingSchedules.data.data })
    }
  }, [existingSchedules, form])

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "schedules"
  })

  const handleFieldComplete = (field: string, index: number) => {
    setCurrentStep({ index, field })
    setFirstRender(prev => ({ ...prev, [`${field}-${index}`]: false }))
    setExpandedFields(prev => ({ ...prev, [`${field}-${index}`]: false }))

    // Expandir campos de hora cuando se selecciona el día
    if (field === "dayOfWeek") {
      setFirstRender(prev => ({ ...prev, [`startTime-${index}`]: true }))
      setExpandedFields(prev => ({ ...prev, [`startTime-${index}`]: true }))
    }

    // Expandir campo de hora de finalización cuando se selecciona la hora de inicio
    if (field === "startTime") {
      setFirstRender(prev => ({ ...prev, [`endTime-${index}`]: true }))
      setExpandedFields(prev => ({ ...prev, [`endTime-${index}`]: true }))
    }

    // Avanzar al siguiente campo o horario
    const currentSchedule = form.getValues(`schedules.${index}`)
    if (field === "dayOfWeek" && currentSchedule.startTime) {
      setCurrentStep({ index, field: "startTime" })
    } else if (field === "startTime" && currentSchedule.endTime) {
      setCurrentStep({ index, field: "endTime" })
    } else if (field === "endTime" && currentSchedule.maxCapacity) {
      setCurrentStep({ index, field: "maxCapacity" })
    } else if (field === "maxCapacity" && index < fields.length - 1) {
      setCurrentScheduleIndex(index + 1)
      setCurrentStep({ index: index + 1, field: "dayOfWeek" })
    }
  }

  const handleTimeSelect = (time: string, field: 'startTime' | 'endTime', index: number) => {
    form.setValue(`schedules.${index}.${field}`, time)
    handleFieldComplete(field, index)
  }

  const toggleField = (field: string) => {
    setExpandedFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handlePrevSchedule = () => {
    if (currentScheduleIndex > 0) {
      setCurrentScheduleIndex(prev => prev - 1)
    }
  }

  const handleNextSchedule = () => {
    if (currentScheduleIndex < fields.length - 1) {
      setCurrentScheduleIndex(prev => prev + 1)
    }
  }

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    try {
      const formattedSchedules = data.schedules.map(schedule => ({
        ...schedule,
        dayOfWeek: parseInt(schedule.dayOfWeek),
        maxCapacity: parseInt(schedule.maxCapacity)
      }))
      await createSchedules(clubId, { schedules: formattedSchedules })
      queryClient.invalidateQueries({ queryKey: ["schedules", clubId] })
      toast({
        title: hasExistingSchedules ? "Horarios actualizados" : "Horarios creados",
        description: hasExistingSchedules
          ? "Los horarios se han actualizado correctamente."
          : "Los horarios se han creado correctamente.",
      })
      navigate("/")
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Error al guardar los horarios"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6" ref={formRef}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ScheduleHeader hasExistingSchedules={hasExistingSchedules} />
        
        <ScheduleCarousel
          form={form}
          fields={fields}
          currentScheduleIndex={currentScheduleIndex}
          currentStep={currentStep}
          expandedFields={expandedFields}
          firstRender={firstRender}
          handlePrevSchedule={handlePrevSchedule}
          handleNextSchedule={handleNextSchedule}
          handleFieldComplete={handleFieldComplete}
          handleTimeSelect={handleTimeSelect}
          toggleField={toggleField}
          remove={remove}
          append={append}
          setCurrentScheduleIndex={setCurrentScheduleIndex}
        />

        <ScheduleActions
          isLoading={isLoading}
          hasExistingSchedules={hasExistingSchedules}
          onCancel={() => navigate("/")}
        />
      </form>
    </div>
  )
}
