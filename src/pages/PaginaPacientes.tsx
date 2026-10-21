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
import { api } from "../services/api";
import { FormularioPaciente } from "../components/FormularioPaciente";

interface PacienteAPI {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
}

export function PaginaPacientes() {
  const [pacientes, setPacientes] = useState<PacienteAPI[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarPacientes() {
      setCarregando(true);
      setErro("");
      setSucesso("");

      try {
        const resposta = await api.get<PacienteAPI[]>("/pacientes");

        if (!ativo) return;

        setPacientes(resposta.data);
        setSucesso(
          `${resposta.data.length} paciente(s) carregado(s) com sucesso.`,
        );
      } catch (error: unknown) {
        if (!ativo) return;

        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            setErro(
              "Sessão ausente ou expirada. Faça login para consultar os pacientes.",
            );
          } else if (error.response?.status === 403) {
            setErro(
              "Seu usuário não tem permissão para consultar os pacientes. É necessário o papel RECEPCIONISTA.",
            );
          } else {
            setErro(
              error.response
                ? `Não foi possível carregar os pacientes (HTTP ${error.response.status}).`
                : "Não foi possível conectar à API. Confira se o backend está rodando em http://localhost:3000.",
            );
          }
        } else {
          setErro("Ocorreu um erro inesperado ao carregar os pacientes.");
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    void carregarPacientes();

    return () => {
      ativo = false;
    };
  }, []);

  const handlePacienteCriado = (paciente: PacienteAPI) => {
    setPacientes((anteriores) => [paciente, ...anteriores]);
    setBusqueda("");
    setErro("");
    setSucesso(
      `Paciente ${paciente.nombre} ${paciente.apellido} cadastrado com sucesso!`,
    );
  };
  const pacientesFiltrados = pacientes.filter((paciente) => {
    const texto = busqueda.trim().toLowerCase();
    const nomeCompleto =
      `${paciente.nombre} ${paciente.apellido}`.toLowerCase();

    return (
      nomeCompleto.includes(texto) ||
      paciente.email.toLowerCase().includes(texto)
    );
  });

  const limparFiltros = () => setBusqueda("");

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

        {carregando && (
          <div
            role="status"
            className="rounded-xl bg-teal-50 p-4 text-teal-800"
          >
            Carregando pacientes...
          </div>
        )}

        {!carregando && erro && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
          >
            <p className="font-semibold">
              Não foi possível carregar os pacientes
            </p>
            <p className="mt-1 text-sm">{erro}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-3 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Tentar novamente
            </button>
          </div>
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

          {!carregando && !erro && (
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
                      {pacientesFiltrados.map((paciente) => (
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
                              Ver detalhes →
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {pacientesFiltrados.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
                  <p className="font-semibold text-slate-800">
                    Nenhum paciente encontrado
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Tente outro nome, sobrenome ou e-mail.
                  </p>
                </div>
              )}

              <p className="text-sm text-slate-500" aria-live="polite">
                {pacientesFiltrados.length} paciente(s) encontrado(s)
              </p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
