import type { Paciente } from "./paciente-api";

// Dados necessários para cadastrar um paciente.
export type CrearPacienteDTO = Omit<Paciente, "id">;

// Dados que podem ser enviados ao atualizar um paciente.
export type ActualizarPacienteDTO = Partial<Omit<Paciente, "id">>;

// Informações resumidas para listas e cartões.
export type ResumenPaciente = Pick<
  Paciente,
  "id" | "nombre" | "apellido" | "email"
>;
