import { Link, useNavigate, useParams } from "react-router-dom";
import { PACIENTES_INICIALES } from "./PaginaPacientes";
import { PaginaNotFound } from "./PaginaNotFound";
import { BadgeEstado } from "../components/BadgeEstado";

export function PaginaDetallePaciente() {
  const { id } = useParams();
  const navigate = useNavigate();

  const paciente = PACIENTES_INICIALES.find((item) => item.id === id);

  if (!paciente) {
    return <PaginaNotFound />;
  }

  return (
    <main className="space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="font-semibold text-teal-700 hover:text-teal-900"
      >
        ← Volver
      </button>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">
          {paciente.nombre} {paciente.apellido}
        </h1>

        <div className="mt-5">
          <BadgeEstado estado={paciente.estado} />
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-slate-500">Correo electrónico</dt>
            <dd className="mt-1 font-medium text-slate-900">
              {paciente.email}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">Teléfono</dt>
            <dd className="mt-1 font-medium text-slate-900">
              {paciente.telefono}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">Especialidad asignada</dt>
            <dd className="mt-1 font-medium text-slate-900">
              {paciente.especialidadAsignada}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">Última cita</dt>
            <dd className="mt-1 font-medium text-slate-900">
              {paciente.ultimaCita}
            </dd>
          </div>
        </dl>

        <Link
          to="/pacientes"
          className="mt-8 inline-block rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
        >
          Ver todos los pacientes
        </Link>
      </section>
    </main>
  );
}
