import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { CitaformData } from "../schema/citaSchema";
import type { EstadoCita } from "./filtrosStore";

export interface Cita extends CitaformData {
  id: string;
  estado: EstadoCita;
}

interface CitasState {
  citas: Cita[];
  citaSeleccionada: Cita | null;
  cargando: boolean;

  cargarPorPaciente: (id: string) => Promise<Cita[]>;
  seleccionar: (id: string) => void;
  actualizarEstado: (id: string, estado: EstadoCita) => void;
  agregarCita: (datos: CitaformData) => Cita;
}

export const useCitasStore = create<CitasState>()(
  devtools(
    (set, get) => ({
      citas: [],
      citaSeleccionada: null,
      cargando: false,

      cargarPorPaciente: async (id) => {
        set({ cargando: true });

        try {
          const citasPaciente = get().citas.filter(
            (cita) =>
              cita.pacienteNombre.trim().toLowerCase() ===
              id.trim().toLowerCase(),
          );

          set({ citaSeleccionada: null });

          return citasPaciente;
        } finally {
          set({ cargando: false });
        }
      },

      seleccionar: (id) => {
        const cita = get().citas.find((item) => item.id === id) ?? null;
        set({ citaSeleccionada: cita });
      },

      actualizarEstado: (id, estado) => {
        set((state) => ({
          citas: state.citas.map((cita) =>
            cita.id === id ? { ...cita, estado } : cita,
          ),
          citaSeleccionada:
            state.citaSeleccionada?.id === id
              ? { ...state.citaSeleccionada, estado }
              : state.citaSeleccionada,
        }));
      },

      agregarCita: (datos) => {
        const nuevaCita: Cita = {
          ...datos,
          id: crypto.randomUUID(),
          estado: "pendiente",
        };

        set((state) => ({
          citas: [...state.citas, nuevaCita],
        }));

        return nuevaCita;
      },
    }),
    { name: "CitasStore" },
  ),
);
