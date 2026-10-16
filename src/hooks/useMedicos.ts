import { useEffect, useState } from "react";

export interface Medico {
  id: string;
  nombre: string;
  especialidad: string;
}

const medicosSimulados: Medico[] = [
  {
    id: "1",
    nombre: "Dra. Ana Silva",
    especialidad: "Clínica general",
  },
  {
    id: "2",
    nombre: "Dr. Carlos Mendes",
    especialidad: "Cardiología",
  },
  {
    id: "3",
    nombre: "Dra. Mariana Costa",
    especialidad: "Pediatría",
  },
];

export function useMedicos() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMedicos(medicosSimulados);
      setCargando(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return { medicos, cargando };
}
