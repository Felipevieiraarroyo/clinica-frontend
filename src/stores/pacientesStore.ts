import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  listarPacientes,
  cadastrarPaciente,
  editarPaciente,
  excluirPaciente,
  type Paciente,
  type NovoPaciente,
} from "../services/pacientes.service";

interface PacientesState {
  pacientes: Paciente[];
  cargando: boolean;
  error: string | null;

  cargar: (query?: string) => Promise<void>;
  crear: (datos: NovoPaciente) => Promise<Paciente>;
  actualizar: (id: number, datos: NovoPaciente) => Promise<Paciente>;
  eliminar: (id: number) => Promise<void>;
}

function obtenerMensajeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Ocurrió un error al gestionar los pacientes.";
}

export const usePacientesStore = create<PacientesState>()(
  devtools(
    (set) => ({
      pacientes: [],
      cargando: false,
      error: null,

      cargar: async (query) => {
        set({ cargando: true, error: null });

        try {
          const datos = await listarPacientes();
          const texto = query?.trim().toLowerCase() ?? "";

          const pacientesFiltrados = texto
            ? datos.filter((paciente) => {
                const nombreCompleto =
                  `${paciente.nombre} ${paciente.apellido}`.toLowerCase();

                return (
                  nombreCompleto.includes(texto) ||
                  paciente.email.toLowerCase().includes(texto)
                );
              })
            : datos;

          set({ pacientes: pacientesFiltrados });
        } catch (error: unknown) {
          set({ error: obtenerMensajeError(error) });
          throw error;
        } finally {
          set({ cargando: false });
        }
      },

      crear: async (datos) => {
        set({ error: null });

        try {
          const nuevoPaciente = await cadastrarPaciente(datos);

          set((state) => ({
            pacientes: [nuevoPaciente, ...state.pacientes],
          }));

          return nuevoPaciente;
        } catch (error: unknown) {
          set({ error: obtenerMensajeError(error) });
          throw error;
        }
      },

      actualizar: async (id, datos) => {
        set({ error: null });

        try {
          const pacienteAtualizado = await editarPaciente(id, datos);

          set((state) => ({
            pacientes: state.pacientes.map((paciente) =>
              paciente.id === id ? pacienteAtualizado : paciente,
            ),
          }));

          return pacienteAtualizado;
        } catch (error: unknown) {
          set({ error: obtenerMensajeError(error) });
          throw error;
        }
      },

      eliminar: async (id) => {
        set({ error: null });

        try {
          await excluirPaciente(id);

          set((state) => ({
            pacientes: state.pacientes.filter((paciente) => paciente.id !== id),
          }));
        } catch (error: unknown) {
          set({ error: obtenerMensajeError(error) });
          throw error;
        }
      },
    }),
    { name: "PacientesStore" },
  ),
);
