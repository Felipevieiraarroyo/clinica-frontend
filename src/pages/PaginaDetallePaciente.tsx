import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { api } from "../services/api";

interface PacienteAPI {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
}

export function PaginaDetallePaciente() {
  const { id } = useParams<{ id: string }>();

  const [paciente, setPaciente] = useState<PacienteAPI | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarPaciente() {
      if (!id || !/^\d+$/.test(id)) {
        setErro("O identificador do paciente é inválido.");
        setCarregando(false);
        return;
      }

      try {
        setCarregando(true);
        setErro("");

        const resposta = await api.get<PacienteAPI>(`/pacientes/${id}`);

        if (ativo) {
          setPaciente(resposta.data);
        }
      } catch (error: unknown) {
        if (!ativo) return;

        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            setErro("Paciente não encontrado.");
          } else if (error.response?.status === 401) {
            setErro("Sua sessão expirou ou você precisa fazer login.");
          } else if (error.response?.status === 403) {
            setErro(
              "Seu usuário não tem permissão para consultar este paciente.",
            );
          } else if (error.response) {
            setErro(
              `Não foi possível carregar o paciente (HTTP ${error.response.status}).`,
            );
          } else {
            setErro(
              "Não foi possível conectar à API. Confira se o backend está funcionando.",
            );
          }
        } else {
          setErro("Ocorreu um erro inesperado ao carregar o paciente.");
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    void carregarPaciente();

    return () => {
      ativo = false;
    };
  }, [id]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link
          to="/pacientes"
          className="inline-flex items-center text-sm font-semibold text-teal-700 hover:text-teal-900"
        >
          ← Voltar para pacientes
        </Link>

        <header>
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
            Clinical Health Core
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Detalhes do paciente
          </h1>
        </header>

        {carregando && (
          <div
            role="status"
            className="rounded-xl bg-teal-50 p-4 text-teal-800"
          >
            Carregando dados do paciente...
          </div>
        )}

        {!carregando && erro && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700"
          >
            <p className="font-semibold">Não foi possível abrir os detalhes</p>
            <p className="mt-1 text-sm">{erro}</p>
          </div>
        )}

        {!carregando && !erro && paciente && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 text-2xl font-bold text-teal-800">
              {paciente.nombre.charAt(0)}
              {paciente.apellido.charAt(0)}
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              {paciente.nombre} {paciente.apellido}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Código do paciente: {paciente.id}
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">E-mail</p>
                <p className="mt-1 wrap-break-word font-medium text-slate-900">
                  {paciente.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Telefone</p>
                <p className="mt-1 font-medium text-slate-900">
                  {paciente.telefono}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Data de nascimento</p>
                <p className="mt-1 font-medium text-slate-900">
                  {new Date(`${paciente.fechaNacimiento}`).toLocaleDateString(
                    "pt-BR",
                    {
                      timeZone: "UTC",
                    },
                  )}
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
