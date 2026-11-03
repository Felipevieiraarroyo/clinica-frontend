import { useCitasStore } from "../stores/citasStore";

export function useCitas() {
  const citas = useCitasStore((state) => state.citas);
  const citaSeleccionada = useCitasStore((state) => state.citaSeleccionada);
  const cargando = useCitasStore((state) => state.cargando);

  const cargarPorPaciente = useCitasStore((state) => state.cargarPorPaciente);
  const seleccionar = useCitasStore((state) => state.seleccionar);
  const actualizarEstado = useCitasStore((state) => state.actualizarEstado);
  const agregarCita = useCitasStore((state) => state.agregarCita);

  return {
    citas,
    citaSeleccionada,
    cargando,
    cargarPorPaciente,
    seleccionar,
    actualizarEstado,
    agregarCita,
  };
}
