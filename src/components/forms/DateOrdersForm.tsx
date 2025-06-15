import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSchedules } from "@/api/clubDate";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const daysOfWeek = [
  { value: "1", label: "Lunes" },
  { value: "2", label: "Martes" },
  { value: "3", label: "Miércoles" },
  { value: "4", label: "Jueves" },
  { value: "5", label: "Viernes" },
  { value: "6", label: "Sábado" },
  { value: "7", label: "Domingo" },
];

// Función para validar que la hora de fin sea posterior a la hora de inicio
const validateTimeRange = (startTime: string, endTime: string) => {
  if (!startTime || !endTime) return true;
  return new Date(`2000-01-01T${endTime}`) > new Date(`2000-01-01T${startTime}`);
};

// Función para validar que no haya superposición de horarios
const validateScheduleOverlap = (schedules: any[]) => {
  for (let i = 0; i < schedules.length; i++) {
    for (let j = i + 1; j < schedules.length; j++) {
      if (schedules[i].dayOfWeek === schedules[j].dayOfWeek) {
        const start1 = new Date(`2000-01-01T${schedules[i].startTime}`);
        const end1 = new Date(`2000-01-01T${schedules[i].endTime}`);
        const start2 = new Date(`2000-01-01T${schedules[j].startTime}`);
        const end2 = new Date(`2000-01-01T${schedules[j].endTime}`);

        if (
          (start1 <= end2 && end1 >= start2) ||
          (start2 <= end1 && end2 >= start1)
        ) {
          return false;
        }
      }
    }
  }
  return true;
};

const formSchema = z.object({
  schedules: z.array(
    z.object({
      dayOfWeek: z.string().min(1, "El día es requerido"),
      startTime: z.string()
        .min(1, "La hora de inicio es requerida")
        .refine((time) => {
          const hour = parseInt(time.split(':')[0]);
          return hour >= 8 && hour <= 16;
        }, "El horario debe estar entre las 8:00 y las 16:00"),
      endTime: z.string()
        .min(1, "La hora de fin es requerida")
        .refine((time) => {
          const hour = parseInt(time.split(':')[0]);
          return hour >= 8 && hour <= 16;
        }, "El horario debe estar entre las 8:00 y las 16:00"),
      maxCapacity: z.string()
        .min(1, "La capacidad máxima es requerida")
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
          message: "La capacidad debe ser un número mayor a 0"
        }),
    })
  )
  .min(1, "Debes agregar al menos un horario")
  .refine((schedules) => {
    // Validar que no haya días duplicados
    const days = schedules.map(s => s.dayOfWeek);
    return new Set(days).size === days.length;
  }, "No puedes tener dos horarios para el mismo día")
  .refine((schedules) => {
    // Validar que no haya superposición de horarios
    return validateScheduleOverlap(schedules);
  }, "Los horarios no pueden superponerse")
  .refine((schedules) => {
    // Validar que la hora de fin sea posterior a la hora de inicio
    return schedules.every(schedule => 
      validateTimeRange(schedule.startTime, schedule.endTime)
    );
  }, "La hora de fin debe ser posterior a la hora de inicio"),
});

type FormValues = z.infer<typeof formSchema>;

interface DateOrdersFormProps {
  clubId: string;
}

const DateOrdersForm = ({ clubId }: DateOrdersFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

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
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "schedules",
  });

  const createSchedulesMutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => {
      if (!data.schedules || data.schedules.length === 0) {
        throw new Error("Debe agregar al menos un horario");
      }

      const formattedSchedules = data.schedules.map(schedule => {
        const dayOfWeek = parseInt(schedule.dayOfWeek.toString());
        const maxCapacity = parseInt(schedule.maxCapacity.toString());

        if (isNaN(dayOfWeek) || isNaN(maxCapacity)) {
          throw new Error("Los valores de día y capacidad deben ser números válidos");
        }

        return {
          dayOfWeek,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          maxCapacity
        };
      });

      const dataToSend = {
        schedules: formattedSchedules
      };

      return createSchedules(clubId, dataToSend);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules", clubId] });
      toast.success("Horarios creados exitosamente");
      form.reset();
      setError(null);
    },
    onError: (error: any) => {
      console.error('Error completo:', error);
      const errorMessage = error.response?.data?.message || error.message || "Error al crear los horarios";
      setError(errorMessage);
      toast.error(errorMessage);
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    createSchedulesMutation.mutate(data);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Crear Horarios del Club</h2>
        <p className="mt-2 text-sm text-gray-600">
          Horario permitido: 8:00 - 16:00
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-900">Horario {index + 1}</h3>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Día de la semana
                </label>
                <select
                  {...form.register(`schedules.${index}.dayOfWeek`)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Selecciona un día</option>
                  {daysOfWeek.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
                {form.formState.errors.schedules?.[index]?.dayOfWeek && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.schedules[index]?.dayOfWeek?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacidad máxima
                </label>
                <input
                  type="number"
                  min="1"
                  {...form.register(`schedules.${index}.maxCapacity`)}
                  placeholder="Ej: 20"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {form.formState.errors.schedules?.[index]?.maxCapacity && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.schedules[index]?.maxCapacity?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de inicio
                </label>
                <input
                  type="time"
                  min="08:00"
                  max="16:00"
                  {...form.register(`schedules.${index}.startTime`)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {form.formState.errors.schedules?.[index]?.startTime && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.schedules[index]?.startTime?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de fin
                </label>
                <input
                  type="time"
                  min="08:00"
                  max="16:00"
                  {...form.register(`schedules.${index}.endTime`)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {form.formState.errors.schedules?.[index]?.endTime && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.schedules[index]?.endTime?.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            append({
              dayOfWeek: "",
              startTime: "",
              endTime: "",
              maxCapacity: "",
            })
          }
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar otro horario
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Guardando..." : "Guardar horarios"}
        </button>
      </form>
    </div>
  );
};

export default DateOrdersForm;