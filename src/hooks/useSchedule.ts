import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { createSchedules, getSchedules } from "@/api/clubDate"
import { useToast } from "@/hooks/use-toast"
import { formSchema, FormValues } from "@/components/schedule/scheduleValidation"

export const useScheduleForm = (clubId: string) => {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const queryClient = useQueryClient()

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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "schedules",
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

  const createSchedulesMutation = useMutation({
    mutationFn: (data: FormValues) => {
      if (!data.schedules || data.schedules.length === 0) {
        throw new Error("Debe agregar al menos un horario")
      }

      const formattedSchedules = data.schedules.map((schedule: any) => {
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

      return createSchedules(clubId, { schedules: formattedSchedules })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules", clubId] })
      setShowSuccessAlert(true)
      form.reset()
      setError(null)
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

  // Efecto para ocultar la alerta de éxito
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

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);
      form.clearErrors();

      const schedulesToSubmit = data.schedules.filter((schedule: any) => 
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

      await createSchedulesMutation.mutateAsync(data);

      toast({
        title: "Horarios actualizados",
        description: "La configuración de horarios se ha guardado correctamente.",
      });

      form.reset({
        schedules: schedulesToSubmit
      });

    } catch (error: any) {
      setError(error.data?.message || "Error al guardar los horarios");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    fields,
    append,
    remove,
    onSubmit,
    isSubmitting,
    error,
    setError,
    showSuccessAlert,
    existingSchedules
  }
}