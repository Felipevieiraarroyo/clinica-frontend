import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type EstadoCita =
  | "pendiente"
  | "confirmada"
  | "cancelada"
  | "completada";

interface FiltrosState {
  queryPacientes: string;
  especialidadFiltro: string;
  estadoCitaFiltro: EstadoCita | "Todos";

  setQueryPacientes: (query: string) => void;
  setEspecialidad: (especialidad: string) => void;
  setEstadoCita: (estado: EstadoCita | "Todos") => void;
  resetFiltros: () => void;
}

const estadoInicial = {
  queryPacientes: "",
  especialidadFiltro: "Todas",
  estadoCitaFiltro: "Todos" as const,
};

export const useFiltrosStore = create<FiltrosState>()(
  devtools(
    (set) => ({
      ...estadoInicial,

      setQueryPacientes: (query) => set({ queryPacientes: query }),

      setEspecialidad: (especialidad) =>
        set({ especialidadFiltro: especialidad }),

      setEstadoCita: (estado) => set({ estadoCitaFiltro: estado }),

      resetFiltros: () => set(estadoInicial),
    }),
    { name: "FiltrosStore" },
  ),
);
