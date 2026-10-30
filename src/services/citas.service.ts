import { api } from "./api";
import type { RespuestaPaginada } from "../types/api";
import type {
  CitaHistorial,
  CitaAgendaMedico,
  EstadoConsultaApi,
} from "../types/cita-api";

export async function listarCitasPaginadas(
  pagina: number,
  estado?: EstadoConsultaApi,
  signal?: AbortSignal,
): Promise<RespuestaPaginada<CitaHistorial>> {
  const resposta = await api.get<RespuestaPaginada<CitaHistorial>>(
    "/appointments",
    {
      params: {
        pagina,
        limite: 10,
        ...(estado ? { estado } : {}),
      },
      signal,
    },
  );

  return resposta.data;
}

export interface CrearCitaDTO {
  pacienteId: number;
  medicoId: number;
  fechaHora: string;
}

export interface CitaCreadaApi {
  id: number;
  pacienteId: number;
  medicoId: number;
  fechaHora: string;
  estado: EstadoConsultaApi;
}

export async function crearCita(datos: CrearCitaDTO): Promise<CitaCreadaApi> {
  const resposta = await api.post<CitaCreadaApi>("/appointments", datos);

  return resposta.data;
}
export async function actualizarEstadoCita(
  id: number,
  estado: EstadoConsultaApi,
): Promise<void> {
  await api.patch(`/appointments/${id}/status`, {
    estado,
  });
}
export async function listarAgendaMedico(): Promise<CitaAgendaMedico[]> {
  const resposta = await api.get<CitaAgendaMedico[]>(
    "/appointments/doctors/appointments",
  );

  return resposta.data;
}

export async function completarCitaMedico(id: number): Promise<void> {
  await api.patch(`/appointments/${id}/complete`);
}
