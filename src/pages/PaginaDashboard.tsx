import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MetricCard } from "../components/MetricCard";
import { StatusBadge } from "../components/StatusBadge";
import { api } from "../services/api";
import type { Metrica } from "../types";
import { extraerMensajeError } from "../lib/errorHandler";
import { GraficoEspecialidades } from "../components/GraficoEspecialidades";
import { useAuthStore } from "../stores/authStore";
import { SkeletonMetricCard } from "../components/SkeletonMetricCard";
import { AlertaBanner } from "../components/ui/AlertaBanner";

interface Paciente {
  id: number;
}

interface Medico {
  id: number;
}

interface Consulta {
  id: number;
  fechaHora: string;
  estado: "PROGRAMADA" | "COMPLETADA" | "CANCELADA";
}

type ListaResposta<T> =
  | T[]
  | {
      data?: T[];
      total?: number;
    };

interface TotaisDashboard {
  pacientes: number;
  medicos: number;
  programadas: number;
  completadasHoy: number;
}
interface CorteDiario {
  estado: "PROGRAMADA" | "COMPLETADA" | "CANCELADA";
  _count: {
    estado: number;
  };
}

function extrairLista<T>(resposta: ListaResposta<T>): T[] {
  if (Array.isArray(resposta)) {
    return resposta;
  }

  return resposta.data ?? [];
}

function esHoy(fechaHora: string): boolean {
  const fecha = new Date(fechaHora);

  if (Number.isNaN(fecha.getTime())) {
    return false;
  }

  const hoy = new Date();

  return (
    fecha.getFullYear() === hoy.getFullYear() &&
    fecha.getMonth() === hoy.getMonth() &&
    fecha.getDate() === hoy.getDate()
  );
}

export function PaginaDashboard() {
  const navigate = useNavigate();
  const perfil = useAuthStore((state) => state.usuario?.rol ?? null);
  const ehGerencia = perfil === "GERENCIA";

  const [mantenimiento, setMantenimiento] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [erro, setErro] = useState("");
  const [totais, setTotais] = useState<TotaisDashboard>({
    pacientes: 0,
    medicos: 0,
    programadas: 0,
    completadasHoy: 0,
  });

  const carregarDados = useCallback(async () => {
    setCargando(true);
    setErro("");

    try {
      if (ehGerencia) {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, "0");
        const dia = String(hoje.getDate()).padStart(2, "0");
        const dataHoje = `${ano}-${mes}-${dia}`;

        const [resMedicos, resProgramadas, resCorte] = await Promise.all([
          api.get<ListaResposta<Medico>>("/medicos"),
          api.get<ListaResposta<Consulta>>("/appointments", {
            params: { estado: "PROGRAMADA" },
          }),
          api.get<CorteDiario[]>("/reports/daily-cutoff", {
            params: { date: dataHoje },
          }),
        ]);

        const medicos = extrairLista(resMedicos.data);
        const programadas = extrairLista(resProgramadas.data);

        const completadasHoy =
          resCorte.data.find((item) => item.estado === "COMPLETADA")?._count
            .estado ?? 0;

        setTotais({
          pacientes: 0,
          medicos: medicos.length,
          programadas: programadas.length,
          completadasHoy,
        });

        return;
      }

      const [resPacientes, resMedicos, resProgramadas, resCompletadas] =
        await Promise.all([
          api.get<ListaResposta<Paciente>>("/pacientes"),
          api.get<ListaResposta<Medico>>("/medicos"),
          api.get<ListaResposta<Consulta>>("/appointments", {
            params: { estado: "PROGRAMADA" },
          }),
          api.get<ListaResposta<Consulta>>("/appointments", {
            params: { estado: "COMPLETADA" },
          }),
        ]);

      const pacientes = extrairLista(resPacientes.data);
      const medicos = extrairLista(resMedicos.data);
      const programadas = extrairLista(resProgramadas.data);
      const completadas = extrairLista(resCompletadas.data);

      setTotais({
        pacientes:
          !Array.isArray(resPacientes.data) &&
          typeof resPacientes.data.total === "number"
            ? resPacientes.data.total
            : pacientes.length,
        medicos:
          !Array.isArray(resMedicos.data) &&
          typeof resMedicos.data.total === "number"
            ? resMedicos.data.total
            : medicos.length,
        programadas:
          !Array.isArray(resProgramadas.data) &&
          typeof resProgramadas.data.total === "number"
            ? resProgramadas.data.total
            : programadas.length,
        completadasHoy: completadas.filter((consulta) =>
          esHoy(consulta.fechaHora),
        ).length,
      });
    } catch (error: unknown) {
      setErro(extraerMensajeError(error));
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          setErro("Seu usuário não tem permissão para consultar os dados.");
        } else if (error.response?.status === 401) {
          setErro("Sua sessão expirou. Faça login novamente.");
        } else if (error.code === "ECONNABORTED") {
          setErro("A API demorou demais para responder. Tente novamente.");
        } else if (!error.response) {
          setErro(
            "Não foi possível conectar à API. Confira se o backend está ligado.",
          );
        } else {
          setErro("Não foi possível carregar os dados do Dashboard.");
        }
      } else {
        setErro("Ocorreu um erro inesperado ao carregar o Dashboard.");
      }
    } finally {
      setCargando(false);
    }
  }, [ehGerencia]);

  useEffect(() => {
    void carregarDados();
  }, [carregarDados]);

  const metricas: Metrica[] = [
    {
      id: "pacientes",
      titulo: "Pacientes",
      valor: cargando ? "..." : totais.pacientes,
      descripcion: "Pacientes registrados",
      tendencia: "positiva",
      icono: "👥",
    },
    {
      id: "medicos",
      titulo: "Médicos",
      valor: cargando ? "..." : totais.medicos,
      descripcion: "Médicos registrados",
      tendencia: "positiva",
      icono: "🩺",
    },
    {
      id: "programadas",
      titulo: "Citas programadas",
      valor: cargando ? "..." : totais.programadas,
      descripcion: "Consultas con estado PROGRAMADA",
      tendencia: "neutra",
      icono: "📅",
    },
    {
      id: "completadas",
      titulo: "Completadas hoy",
      valor: cargando ? "..." : totais.completadasHoy,
      descripcion: "Consultas completadas en la fecha de hoy",
      tendencia: "positiva",
      icono: "✅",
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
          {!ehGerencia && (
            <button
              type="button"
              onClick={() => navigate("/pacientes")}
              className="rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white transition hover:bg-teal-800"
            >
              Ver pacientes
            </button>
          )}
        </div>
      </header>

      {mantenimiento && (
        <div
          role="alert"
          className="rounded-lg bg-rose-100 p-4 font-medium text-rose-800"
        >
          El sistema está en modo mantenimiento.
        </div>
      )}

      {erro && (
        <div className="space-y-3">
          <AlertaBanner
            tipo="error"
            titulo="Erro ao carregar o Dashboard"
            mensaje={erro}
          />

          <button
            type="button"
            onClick={() => void carregarDados()}
            disabled={cargando}
            className="rounded-lg bg-rose-700 px-4 py-2 font-semibold text-white hover:bg-rose-800 disabled:opacity-60"
          >
            {cargando ? "Carregando..." : "Tentar novamente"}
          </button>
        </div>
      )}

      {cargando && (
        <p role="status" className="text-sm text-slate-500">
          Cargando dados reales de la clinica...
        </p>
      )}

      <section
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Métricas da clínica"
      >
        {cargando
          ? Array.from({ length: ehGerencia ? 3 : 4 }).map((_, index) => (
              <SkeletonMetricCard key={index} />
            ))
          : metricas
              .filter((metrica) => !ehGerencia || metrica.id !== "pacientes")
              .map((metrica) => (
                <MetricCard key={metrica.id} metrica={metrica} />
              ))}
      </section>

      {ehGerencia && <GraficoEspecialidades />}

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">
          Estado del sistema
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Puedes activar el modo manutencion para ver el visual.
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
          {mantenimiento ? "Desativar manutenção" : "Ativar manutenção"}
        </button>
      </section>
    </div>
  );
}
