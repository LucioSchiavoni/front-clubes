import instance from "@/config/axios";

// Tipos para los parámetros
interface ScheduleParams {
  clubId: string;
  dayOfWeek?: number;
  time?: string;
}

interface Schedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  maxCapacity: number;
}

interface CreateSchedulesData {
  schedules: Schedule[];
}

// Crear horarios para un club
export const createSchedules = (clubId: string, data: CreateSchedulesData) => {
  return instance.post(`/club/${clubId}/schedules`, data);
};

// Obtener horarios de un club
export const getSchedules = (clubId: string) => {
  return instance.get(`/club/${clubId}/schedules`);
};

// Obtener días disponibles para reservas
export const getAvailableDays = (clubId: string) => {
  return instance.get(`/club/${clubId}/available-days`);
};

// Verificar disponibilidad para una fecha/hora específica
export const checkAvailability = ({ clubId, dayOfWeek, time }: ScheduleParams) => {
  return instance.get(`/club/${clubId}/check-availability`, {
    params: { dayOfWeek, time }
  });
};

// Actualizar un horario específico
export const updateSchedule = (scheduleId: string, data: Schedule) => {
  return instance.put(`/schedules/${scheduleId}`, data);
};

// Eliminar un horario específico
export const deleteSchedule = (scheduleId: string) => {
  return instance.delete(`/schedules/${scheduleId}`);
};



