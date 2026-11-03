export type EstadoConsultaApi = "PROGRAMADA" | "COMPLETADA" | "CANCELADA";

export interface CitaHistorial {
  id: number;
  fechaHora: string;
  estado: EstadoConsultaApi;
  paciente: {
    id: number;
    nombre: string;
    apellido: string;
  };
  medico: {
    id: number;
    nombre: string;
    apellido: string;
    especialidad: {
      id: number;
      nombre: string;
    };
  };
}
export interface CitaAgendaMedico {
  id: number;
  fechaHora: string;
  estado: EstadoConsultaApi;
  paciente: {
    id: number;
    nombre: string;
    apellido: string;
  };
}
