/*
 *  Problemas encontrados en el código generado por IA:
 * 1. La manipulación directa del DOM dificulta el control de la interfaz en React.
 * 2. La lógica estaba mezclada con el HTML.
 * 3. La interfaz no estaba dividida en componentes reutilizables.
 * 4. Los estados de los pacientes no están protegidos por tipos específicos.
 */

import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import { FormularioPaciente } from "../components/FormularioPaciente";
import { usePacientesStore } from "../stores/pacientesStore";
import type { Paciente } from "../services/pacientes.service";
import { useFiltrosStore } from "../stores/filtrosStore";
import { useDebounce } from "../hooks/useDebounce";
import { extraerMensajeError } from "../lib/errorHandler";
import { SkeletonPacienteRow } from "../components/SkeletonPacienteRow";
import { ModalConfirmacion } from "../components/ui/ModalConfirmacion";
import { AlertaBanner } from "../components/ui/AlertaBanner";

export function PaginaPacientes() {
  const pacientes = usePacientesStore((state) => state.pacientes);
  const carregando = usePacientesStore((state) => state.cargando);
  const erroStore = usePacientesStore((state) => state.error);
  const carregarPacientes = usePacientesStore((state) => state.cargar);
  const excluirPacienteStore = usePacientesStore((state) => state.eliminar);

  const busqueda = useFiltrosStore((state) => state.queryPacientes);
  const setBusqueda = useFiltrosStore((state) => state.setQueryPacientes);
  const resetFiltros = useFiltrosStore((state) => state.resetFiltros);

  const busquedaDebounced = useDebounce(busqueda, 350);
  const buscando = busqueda !== busquedaDebounced;

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [pacienteAExcluir, setPacienteAExcluir] = useState<Paciente | null>(
    null,
  );
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    void carregarPacientes(busquedaDebounced, true)
      .then(() => setErro(""))
      .catch((error: unknown) => {
        setErro(extraerMensajeError(error));
      });
  }, [busquedaDebounced, carregarPacientes]);

  const mensagemErro = erro || erroStore || "";

  async function handleExcluirPaciente() {
    if (!pacienteAExcluir) return;

    setExcluindo(true);

    try {
      await excluirPacienteStore(pacienteAExcluir.id);

      toast.success("Paciente apagado com sucesso!");
      setPacienteAExcluir(null);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          toast.error("Você não tem permissão para excluir este paciente.");
        } else if (error.response?.status === 404) {
          toast.error("Paciente não encontrado.");
        } else if (error.response?.status === 409) {
          toast.error(
            "Não é possível excluir este paciente porque possui consultas associadas.",
          );
        } else {
          toast.error(extraerMensajeError(error));
        }
      } else {
        toast.error(extraerMensajeError(error));
      }
    } finally {
      setExcluindo(false);
    }
  }

  const handlePacienteCriado = (paciente: Paciente) => {
    setBusqueda("");
    setErro("");
    setSucesso(
      `Paciente ${paciente.nombre} ${paciente.apellido} cadastrado com sucesso!`,
    );
  };

  const pacientesFiltrados = pacientes;

  const limparFiltros = () => resetFiltros();

  const handleBuscaChange = (event: ChangeEvent<HTMLInputElement>) => {
    setBusqueda(event.target.value);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
            Clinical Health Core
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Pacientes
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Consulte os pacientes cadastrados na API da clínica.
          </p>
        </header>

        <section
          aria-label="Resumo de pacientes"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm text-slate-500">
            Total de pacientes cadastrados
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {carregando ? "…" : pacientes.length}
          </p>
        </section>

        {carregando && pacientes.length === 0 && (
          <div
            role="status"
            className="rounded-xl bg-teal-50 p-4 text-teal-800"
          >
            Carregando pacientes...
          </div>
        )}
        <label className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:max-w-xl sm:flex-1">
          <span aria-hidden="true">🔎</span>

          <input
            type="search"
            value={busqueda}
            onChange={handleBuscaChange}
            placeholder="Buscar por nombre, apellido o correo... "
            aria-label="Buscar pacientes"
            className="w-full bg-transparent text-sm text-slate-800 outline-none"
            disabled={carregando || Boolean(erro)}
          />

          {buscando && (
            <span
              role="status"
              aria-label="Aguardando busqueda"
              className="size-4 shrink-0 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600"
            ></span>
          )}
        </label>

        {!carregando && mensagemErro && (
          <AlertaBanner
            tipo="error"
            titulo="No fue posible cargar los pacientes"
            mensaje={mensagemErro}
          />
        )}

        {!carregando && !erro && sucesso && (
          <p
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
          >
            {sucesso}
          </p>
        )}

        {!carregando && !erro && (
          <FormularioPaciente onPacienteCriado={handlePacienteCriado} />
        )}

        <section className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:max-w-xl sm:flex-1">
              <span aria-hidden="true">🔎</span>
              <input
                type="search"
                value={busqueda}
                onChange={handleBuscaChange}
                placeholder="Buscar por nombre, apellido o email..."
                aria-label="Buscar pacientes"
                className="w-full bg-transparent text-sm text-slate-800 outline-none"
                disabled={carregando || Boolean(erro)}
              />
            </label>

            <button
              type="button"
              onClick={limparFiltros}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Limpar busca
            </button>
          </div>

          {!erro && (
            <>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-\[650px] text-left">
                    <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-5 py-4">Paciente</th>
                        <th className="px-5 py-4">Telefone</th>
                        <th className="px-5 py-4">Data de nascimento</th>
                        <th className="px-5 py-4">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {carregando ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <SkeletonPacienteRow key={index} />
                        ))
                      ) : pacientesFiltrados.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-5 py-10 text-center text-slate-500"
                          >
                            <p className="font-semibold text-slate-700">
                              Nenhum paciente encontrado.
                            </p>
                            <p className="mt-1 text-sm">
                              Busque por outro nome ou correo eletrônico.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        pacientesFiltrados.map((paciente) => (
                          <tr key={paciente.id} className="hover:bg-slate-50">
                            <td className="px-5 py-4">
                              <p className="font-semibold text-slate-900">
                                {paciente.nombre} {paciente.apellido}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
                                {paciente.email}
                              </p>
                            </td>
                            <td className="px-5 py-4 text-sm text-slate-600">
                              {paciente.telefono}
                            </td>
                            <td className="px-5 py-4 text-sm text-slate-600">
                              {new Date(
                                paciente.fechaNacimiento,
                              ).toLocaleDateString("pt-BR")}
                            </td>
                            <td className="px-5 py-4">
                              <Link
                                to={`/pacientes/${paciente.id}`}
                                className="text-sm font-semibold text-teal-700 hover:text-teal-900"
                              >
                                Ver detalles →
                              </Link>
                              <button
                                type="button"
                                onClick={() => setPacienteAExcluir(paciente)}
                                className="ml-4 text-sm font-semibold text-red-600 hover:text-red-800"
                              >
                                Excluir
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-sm text-slate-500" aria-live="polite">
                {pacientesFiltrados.length} paciente(s) encontrado(s)
              </p>
            </>
          )}
        </section>
      </div>
      <ModalConfirmacion
        abierto={pacienteAExcluir !== null}
        titulo="Confirmar exclusão"
        mensaje={
          pacienteAExcluir
            ? `Deseja realmente excluir ${pacienteAExcluir.nombre} ${pacienteAExcluir.apellido}?`
            : ""
        }
        textoConfirmar="Excluir paciente"
        cargando={excluindo}
        onConfirmar={() => void handleExcluirPaciente()}
        onCancelar={() => setPacienteAExcluir(null)}
      />
    </main>
  );
}
