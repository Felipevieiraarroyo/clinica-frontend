import { useEffect, useState } from "react";
import { listarPacientes, type Paciente } from "../services/pacientes.service";

export type { Paciente };

export function usePacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;

    async function cargarPacientes() {
      try {
        setCargando(true);
        setError(null);

        const datos = await listarPacientes();

        if (activo) {
          setPacientes(datos);
        }
      } catch {
        if (activo) {
          setError("No fue posible cargar los pacientes.");
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    cargarPacientes();

    return () => {
      activo = false;
    };
  }, []);

  return { pacientes, cargando, error };
}
