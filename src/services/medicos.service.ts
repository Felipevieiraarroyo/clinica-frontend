import { api } from "./api";

export interface Medico {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  especialidadId: number;
  especialidad: {
    id: number;
    nombre: string;
  };
}

export async function listarMedicos(): Promise<Medico[]> {
  const resposta = await api.get<Medico[]>("/medicos");
  return resposta.data;
}
