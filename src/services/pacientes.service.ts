import { api } from "./api";
import type { Paciente } from "../types/paciente-api";
import type { CrearPacienteDTO, ActualizarPacienteDTO } from "../types/dtos";

export type { Paciente } from "../types/paciente-api";
export type { CrearPacienteDTO, ActualizarPacienteDTO } from "../types/dtos";

export async function listarPacientes(query?: string): Promise<Paciente[]> {
  const params = query?.trim() ? { query: query.trim() } : undefined;

  const resposta = await api.get<Paciente[]>("/pacientes", {
    params,
  });

  return resposta.data;
}

export async function buscarPacientePorId(id: number): Promise<Paciente> {
  const resposta = await api.get<Paciente>(`/pacientes/${id}`);
  return resposta.data;
}

export async function cadastrarPaciente(
  dados: CrearPacienteDTO,
): Promise<Paciente> {
  const resposta = await api.post<Paciente>("/pacientes", dados);
  return resposta.data;
}

export async function editarPaciente(
  id: number,
  dados: ActualizarPacienteDTO,
): Promise<Paciente> {
  const resposta = await api.put<Paciente>(`/pacientes/${id}`, dados);

  return resposta.data;
}

export async function excluirPaciente(id: number): Promise<void> {
  await api.delete(`/pacientes/${id}`);
}
