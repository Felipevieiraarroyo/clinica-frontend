import { useEffect } from "react";
import { usePacientesStore } from "../stores/pacientesStore";

export function usePacientes(busqueda = "") {
  const pacientes = usePacientesStore((state) => state.pacientes);
  const cargando = usePacientesStore((state) => state.cargando);
  const error = usePacientesStore((state) => state.error);

  const cargar = usePacientesStore((state) => state.cargar);
  const crear = usePacientesStore((state) => state.crear);
  const actualizar = usePacientesStore((state) => state.actualizar);
  const eliminar = usePacientesStore((state) => state.eliminar);

  useEffect(() => {
    void cargar(busqueda);
  }, [busqueda, cargar]);

  return {
    pacientes,
    cargando,
    error,
    cargar,
    crear,
    actualizar,
    eliminar,
  };
}
