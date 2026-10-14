import type { Paciente } from "../types/paciente";
import { BadgeEstado } from "./BadgeEstado";

interface PacienteRowProps {
  paciente: Paciente;
}

export function PacienteRow({ paciente }: PacienteRowProps) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-800">
          {paciente.nombre.charAt(0)}
          {paciente.apellido.charAt(0)}
        </div>

        <div className="min-w-0">
          <h3 className="truncate font-semibold text-slate-900">
            {paciente.nombre} {paciente.apellido}
          </h3>
          <p className="truncate text-sm text-slate-500">{paciente.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:flex sm:items-center sm:gap-8">
        <div>
          <p className="text-xs text-slate-500">Teléfono</p>
          <p className="mt-1 text-sm font-medium text-slate-700">
            {paciente.telefono}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Especialidad</p>
          <p className="mt-1 text-sm font-medium text-slate-700">
            {paciente.especialidadAsignada}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Última cita</p>
          <p className="mt-1 text-sm font-medium text-slate-700">
            {paciente.ultimaCita}
          </p>
        </div>

        <div className="flex items-center">
          <BadgeEstado estado={paciente.estado} />
        </div>
      </div>
    </article>
  );
}
