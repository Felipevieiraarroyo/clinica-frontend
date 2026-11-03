import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { listarCitasPaginadas } from "../services/citas.service";
import type { CitaHistorial, EstadoConsultaApi } from "../types/cita-api";
import type { RespuestaPaginada } from "../types/api";
import { SkeletonCita } from "../components/SkeletonCita";
import { extraerMensajeError } from "../lib/errorHandler";
import { useAuthStore } from "../stores/authStore";
import { actualizarEstadoCita } from "../services/citas.service";
import { EstadoVacio } from "../components/ui/EstadoVacio";

type EstadoCita = "Todos" | "Programada" | "Completada" | "Cancelada";

const estadosPermitidos: EstadoCita[] = [
  "Todos",
  "Programada",
  "Completada",
  "Cancelada",
];

const estadosApi: Partial<Record<EstadoCita, EstadoConsultaApi>> = {
  Programada: "PROGRAMADA",
  Completada: "COMPLETADA",
  Cancelada: "CANCELADA",
};

export function PaginaHistorialCitas() {
  const [searchParams, setSearchParams] = useSearchParams();
  const usuario = useAuthStore((state) => state.usuario);
  const perfil = usuario?.rol;
  const [atualizandoId, setAtualizandoId] = useState<number | null>(null);

  const paginaParametro = Number(searchParams.get("pagina"));
  const pagina =
    Number.isInteger(paginaParametro) && paginaParametro > 0
      ? paginaParametro
      : 1;

  const estadoParametro = searchParams.get("estado");
  const estado: EstadoCita = estadosPermitidos.includes(
    estadoParametro as EstadoCita,
  )
    ? (estadoParametro as EstadoCita)
    : "Todos";

  const [resultado, setResultado] =
    useState<RespuestaPaginada<CitaHistorial> | null>(null);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Carrega os dados e cancela a requisição anterior
  // quando a página ou o filtro mudar.
  useEffect(() => {
    const controller = new AbortController();

    async function carregarCitas() {
      setCarregando(true);
      setErro(null);

      try {
        const dados = await listarCitasPaginadas(
          pagina,
          estadosApi[estado],
          controller.signal,
        );

        setResultado(dados);
      } catch (error: unknown) {
        if (controller.signal.aborted) return;

        setErro(extraerMensajeError(error));
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    void carregarCitas();

    return () => controller.abort();
  }, [pagina, estado]);

  async function handleActualizarEstado(
    id: number,
    nuevoEstado: EstadoConsultaApi,
  ) {
    try {
      setAtualizandoId(id);
      setErro(null);

      await actualizarEstadoCita(id, nuevoEstado);

      const dados = await listarCitasPaginadas(pagina, estadosApi[estado]);

      setResultado(dados);
    } catch (error: unknown) {
      setErro(extraerMensajeError(error));
    } finally {
      setAtualizandoId(null);
    }
  }

  // Alterar o filtro também reseta a página.
  function handleCambiarEstado(nuevoEstado: EstadoCita) {
    setSearchParams({
      pagina: "1",
      estado: nuevoEstado,
    });
  }

  function handlePaginaAnterior() {
    if (pagina > 1) {
      setSearchParams({
        pagina: String(pagina - 1),
        estado,
      });
    }
  }

  function handlePaginaSiguiente() {
    const totalPaginas = resultado?.totalPaginas ?? 0;

    if (pagina < totalPaginas) {
      setSearchParams({
        pagina: String(pagina + 1),
        estado,
      });
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

  function obtenerEstiloEstado(estadoCita: EstadoConsultaApi) {
    switch (estadoCita) {
      case "PROGRAMADA":
        return "bg-blue-100 text-blue-700";
      case "COMPLETADA":
        return "bg-emerald-100 text-emerald-700";
      case "CANCELADA":
        return "bg-red-100 text-red-700";
    }
  }

  const citas = resultado?.data ?? [];
  const totalPaginas = resultado?.totalPaginas ?? 0;

  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">
          Historial de citas
        </h1>
        <p className="mt-2 text-slate-500">
          Consulta y filtra las citas registradas en la clínica.
        </p>
      </header>

      {/* Filtro de estado */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <label
          htmlFor="filtro-estado"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Filtrar por estado
        </label>

        <select
          id="filtro-estado"
          value={estado}
          onChange={(event) =>
            handleCambiarEstado(event.target.value as EstadoCita)
          }
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 sm:max-w-xs"
        >
          <option value="Todos">Todos</option>
          <option value="Programada">Programadas</option>
          <option value="Completada">Completadas</option>
          <option value="Cancelada">Canceladas</option>
        </select>
      </section>

      {/* Mensagem de erro */}
      {erro && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
        >
          {erro}
        </div>
      )}

      {/* Lista de citas */}
      <section className="space-y-4">
        {carregando
          ? Array.from({ length: 10 }, (_, index) => (
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

                      <p className="text-sm text-slate-600">
                        Médico: {cita.medico.nombre} {cita.medico.apellido}
                      </p>

                      <p className="text-sm text-slate-600">
                        Especialidad: {cita.medico.especialidad.nombre}
                      </p>

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
                        <div className="flex flex-wrap gap-2">
                          {perfil === "MEDICO" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleActualizarEstado(cita.id, "COMPLETADA")
                              }
                              disabled={atualizandoId === cita.id}
                              className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                              {atualizandoId === cita.id
                                ? "Actualizando..."
                                : "Marcar completada"}
                            </button>
                          )}

                          {perfil === "RECEPCIONISTA" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleActualizarEstado(cita.id, "CANCELADA")
                              }
                              disabled={atualizandoId === cita.id}
                              className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                            >
                              {atualizandoId === cita.id
                                ? "Actualizando..."
                                : "Cancelar cita"}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))
            : !erro && (
                <EstadoVacio
                  titulo="Nenhuma consulta encontrada"
                  descripcion="Não existem consultas para este filtro. Experimente selecionar outro estado."
                />
              )}
      </section>

      {/* Controles de paginación */}
      {!carregando && !erro && (
        <section className="flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row">
          <p className="text-sm font-medium text-slate-600">
            Página {pagina} de {Math.max(1, totalPaginas)} —{" "}
            {resultado?.total ?? 0} registros
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handlePaginaAnterior}
              disabled={pagina <= 1}
              className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Anterior
            </button>

            <button
              type="button"
              onClick={handlePaginaSiguiente}
              disabled={pagina >= totalPaginas || totalPaginas === 0}
              className="rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Siguiente →
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
