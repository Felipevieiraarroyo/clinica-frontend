import type { EstadoPaciente } from "../types/paciente";

interface BadgeEstadoProps {
  estado: EstadoPaciente;
}

const estilosEstado: Record<EstadoPaciente, string> = {
  activo: "bg-emerald-100 text-emerald-800",
  inactivo: "bg-slate-100 text-slate-700",
  en_espera: "bg-amber-100 text-amber-800",
};

const etiquetasEstado: Record<EstadoPaciente, string> = {
  activo: "Activo",
  inactivo: "Inactivo",
  en_espera: "En espera",
};

export function BadgeEstado({ estado }: BadgeEstadoProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${estilosEstado[estado]}`}
    >
      {etiquetasEstado[estado]}
    </span>
  );
}
