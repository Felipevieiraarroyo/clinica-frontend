import type { ChangeEvent } from "react";
import type { EstadoPaciente, Paciente } from "../types/paciente";
import { BadgeEstado } from "./BadgeEstado";

interface PacienteRowProps {
  paciente: Paciente;
  onCambiarEstado: (id: string, estado: EstadoPaciente) => void;
  onEliminar: (id: string) => void;
}

export function PacienteRow({
  paciente,
  onCambiarEstado,
  onEliminar,
}: PacienteRowProps) {
  const handleEstadoChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onCambiarEstado(paciente.id, event.target.value as EstadoPaciente);
  };

  const handleEliminar = () => {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar a ${paciente.nombre} ${paciente.apellido}?`,
    );

    if (confirmar) {
      onEliminar(paciente.id);
    }
  };

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

        <div className="flex flex-col gap-2">
          <BadgeEstado estado={paciente.estado} />

          <label className="text-xs text-slate-500">
            Cambiar estado
            <select
              value={paciente.estado}
              onChange={handleEstadoChange}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="en_espera">En espera</option>
            </select>
          </label>

          <button
            type="button"
            onClick={handleEliminar}
            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}
