import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  obtenerCitasPorEspecialidad,
  type CitasPorEspecialidad,
} from "../services/reportes.service";

import { extraerMensajeError } from "../lib/errorHandler";

export function GraficoEspecialidades() {
  const [datos, setDatos] = useState<CitasPorEspecialidad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;

    async function cargarDatos() {
      try {
        const resultado = await obtenerCitasPorEspecialidad();

        if (activo) {
          setDatos(resultado);
          setError(null);
        }
      } catch (err: unknown) {
        if (activo) {
          setError(extraerMensajeError(err));
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    void cargarDatos();

    return () => {
      activo = false;
    };
  }, []);

  if (cargando) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">
          Citas por especialidad
        </h2>
        <p className="mt-4 text-sm text-slate-500">
          Cargando datos del servidor...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">
          Citas por especialidad
        </h2>
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Verifica tu sesión y tus permisos para consultar este reporte.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800">
        Citas por especialidad
      </h2>

      {datos.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          No hay datos disponibles para mostrar.
        </p>
      ) : (
        <div className="mt-5 h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={datos}
              margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="specialty"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={65}
              />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="total_appointments"
                name="Total de citas"
                fill="#0d9488"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
