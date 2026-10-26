import { api } from "./api";

export interface CitasPorEspecialidad {
  specialty: string;
  total_appointments: number;
}

export async function obtenerCitasPorEspecialidad(): Promise<
  CitasPorEspecialidad[]
> {
  const respuesta = await api.get<CitasPorEspecialidad[]>(
    "/reports/appointments-by-specialty",
  );

  return respuesta.data;
}
