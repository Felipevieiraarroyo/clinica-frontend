import { useEffect, useState } from "react";

import {
  completarCitaMedico,
  listarAgendaMedico,
} from "../services/citas.service";

import type { CitaAgendaMedico, EstadoConsultaApi } from "../types/cita-api";

import { SkeletonCita } from "../components/SkeletonCita";
import { extraerMensajeError } from "../lib/errorHandler";

export function PaginaAgendaMedico() {
  const [citas, setCitas] = useState<CitaAgendaMedico[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [atualizandoId, setAtualizandoId] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function carregarAgenda() {
      try {
        setCarregando(true);
        setErro(null);

        const dados = await listarAgendaMedico();

        if (!controller.signal.aborted) {
          setCitas(dados);
        }
      } catch (error: unknown) {
        if (!controller.signal.aborted) {
          setErro(extraerMensajeError(error));
        }
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    void carregarAgenda();

    return () => controller.abort();
  }, []);

  async function handleCompletarCita(id: number) {
    try {
      setAtualizandoId(id);
      setErro(null);

      await completarCitaMedico(id);

      const dados = await listarAgendaMedico();
      setCitas(dados);
    } catch (error: unknown) {
      setErro(extraerMensajeError(error));
    } finally {
      setAtualizandoId(null);
    }
  }

  function formatarFecha(fecha: string) {
    return new Date(fecha).toLocaleString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function obtenerEstiloEstado(estado: EstadoConsultaApi) {
    switch (estado) {
      case "PROGRAMADA":
        return "bg-blue-100 text-blue-700";
      case "COMPLETADA":
        return "bg-emerald-100 text-emerald-700";
      case "CANCELADA":
        return "bg-red-100 text-red-700";
    }
  }

  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Mi agenda médica</h1>

        <p className="mt-2 text-slate-500">
          Consulta tus citas asignadas y actualiza su estado.
        </p>
      </header>

      {erro && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
        >
          {erro}
        </div>
      )}

      <section className="space-y-4">
        {carregando
          ? Array.from({ length: 5 }, (_, index) => (
              <SkeletonCita key={index} />
            ))
          : citas.length > 0
            ? citas.map((cita) => (
                <article
                  key={cita.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                      <h2 className="text-lg font-bold text-slate-900">
                        {cita.paciente.nombre} {cita.paciente.apellido}
                      </h2>

                      <p className="text-sm text-slate-600">Paciente</p>

                      <p className="text-sm font-medium text-slate-700">
                        📅 {formatarFecha(cita.fechaHora)}
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-3">
                      <span
                        className={`w-fit rounded-full px-3 py-1 text-sm font-semibold ${obtenerEstiloEstado(cita.estado)}`}
                      >
                        {cita.estado}
                      </span>

                      {cita.estado === "PROGRAMADA" && (
                        <button
                          type="button"
                          onClick={() => handleCompletarCita(cita.id)}
                          disabled={atualizandoId === cita.id}
                          className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                          {atualizandoId === cita.id
                            ? "Actualizando..."
                            : "Marcar completada"}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))
            : !erro && (
                <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
                  <p className="font-semibold text-slate-700">
                    No tienes citas asignadas.
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Cuando tengas nuevas consultas, aparecerán aquí.
                  </p>
                </div>
              )}
      </section>
    </main>
  );
}
