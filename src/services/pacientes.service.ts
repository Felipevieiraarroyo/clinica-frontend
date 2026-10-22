import { api } from "./api";

export interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
}

export interface NovoPaciente {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
}

export async function listarPacientes(): Promise<Paciente[]> {
  const resposta = await api.get<Paciente[]>("/pacientes");
  return resposta.data;
}

export async function buscarPacientePorId(id: number): Promise<Paciente> {
  const resposta = await api.get<Paciente>(`/pacientes/${id}`);
  return resposta.data;
}

export async function cadastrarPaciente(
  dados: NovoPaciente,
): Promise<Paciente> {
  const resposta = await api.post<Paciente>("/pacientes", dados);
  return resposta.data;
}

export async function editarPaciente(
  id: number,
  dados: NovoPaciente,
): Promise<Paciente> {
  const resposta = await api.put<Paciente>(`/pacientes/${id}`, dados);
  return resposta.data;
}

export async function excluirPaciente(id: number): Promise<void> {
  await api.delete(`/pacientes/${id}`);
}
