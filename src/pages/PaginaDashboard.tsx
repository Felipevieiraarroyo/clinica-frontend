import { useState } from "react";
import { MetricCard } from "../components/MetricCard";
import { StatusBadge } from "../components/StatusBadge";
import { useNavigate } from "react-router";
import type { Metrica } from "../types";

export function PaginaDashboard() {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState(128);
  const [mantenimiento, setMantenimiento] = useState(false);

  const metricas: Metrica[] = [
    {
      id: "pacientes",
      titulo: "Pacientes",
      valor: pacientes,
      descripcion: "Pacientes registrados",
      tendencia: "positiva",
      icono: "👥",
    },
    {
      id: "citas",
      titulo: "Citas Hoy",
      valor: 24,
      descripcion: "Citas programadas para hoy",
      tendencia: "positiva",
      icono: "📅",
    },
    {
      id: "pendientes",
      titulo: "Consultas Pendientes",
      valor: 8,
      descripcion: "Consultas que requieren atención",
      tendencia: "negativa",
      icono: "📋",
    },
    {
      id: "disponibilidad",
      titulo: "Disponibilidad",
      valor: "92%",
      descripcion: "Disponibilidad de atención",
      tendencia: "neutra",
      icono: "🩺",
    },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
            Clínica Salud Integral
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-slate-500">Resumen general de la clínica</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge activo={!mantenimiento} />

          <button
            type="button"
            onClick={() => navigate("/pacientes")}
            className="rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white transition hover:bg-teal-800"
          >
            Ver Pacientes
          </button>
        </div>
      </header>

      {mantenimiento && (
        <div
          role="alert"
          className="rounded-lg bg-rose-100 p-4 font-medium text-rose-800"
        >
          ⚠️ El sistema está en modo mantenimiento.
        </div>
      )}

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {metricas.map((metrica) => (
          <div key={metrica.id}>
            <MetricCard metrica={metrica} />

            {metrica.id === "pacientes" && (
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setPacientes((prev) => prev + 1)}
                  className="rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white hover:bg-teal-800"
                >
                  + Aumentar
                </button>

                <button
                  type="button"
                  onClick={() => setPacientes((prev) => Math.max(0, prev - 1))}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  − Disminuir
                </button>
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">
          Estado del sistema
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Puedes activar el mantenimiento para probar el cambio visual.
        </p>

        <button
          type="button"
          onClick={() => setMantenimiento((prev) => !prev)}
          className={`mt-4 rounded-lg px-4 py-2 font-semibold text-white ${
            mantenimiento
              ? "bg-emerald-700 hover:bg-emerald-800"
              : "bg-rose-600 hover:bg-rose-700"
          }`}
        >
          {mantenimiento ? "Desactivar mantenimiento" : "Activar mantenimiento"}
        </button>
      </section>
    </div>
  );
}
