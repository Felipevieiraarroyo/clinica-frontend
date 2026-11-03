import { useEffect, useState } from "react";
import { listarMedicos, type Medico } from "../services/medicos.service";

export type { Medico };

export function useMedicos() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;

    async function cargarMedicos() {
      try {
        setCargando(true);
        setError(null);

        const datos = await listarMedicos();

        if (activo) {
          setMedicos(datos);
        }
      } catch {
        if (activo) {
          setError("No fue posible cargar los médicos.");
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    cargarMedicos();

    return () => {
      activo = false;
    };
  }, []);

  return { medicos, cargando, error };
}
