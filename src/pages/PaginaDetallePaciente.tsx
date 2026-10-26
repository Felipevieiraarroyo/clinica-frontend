import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { type CrearPacienteDTO } from "../types/dtos";
import { usePacientesStore } from "../stores/pacientesStore";
import { extraerMensajeError } from "../lib/errorHandler";

const formularioInicial: CrearPacienteDTO = {
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  fechaNacimiento: "",
};

function formatarDataParaInput(data: string): string {
  return data.slice(0, 10);
}

export function PaginaDetallePaciente() {
  const { id } = useParams<{ id: string }>();

  const pacientes = usePacientesStore((state) => state.pacientes);
  const carregarPacientes = usePacientesStore((state) => state.cargar);
  const atualizarPaciente = usePacientesStore((state) => state.actualizar);

  const paciente = pacientes.find((item) => item.id === Number(id)) ?? null;

  const [formulario, setFormulario] =
    useState<CrearPacienteDTO>(formularioInicial);
  const [carregando, setCarregando] = useState(true);

  const [salvando, setSalvando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarPaciente() {
      if (!id || !/^\d+$/.test(id) || Number(id) < 1) {
        setErro("O identificador do paciente é inválido.");
        setCarregando(false);
        return;
      }

      setCarregando(true);
      setErro("");

      try {
        await carregarPacientes();

        if (!ativo) return;

        const pacienteEncontrado = usePacientesStore
          .getState()
          .pacientes.find((item) => item.id === Number(id));

        if (!pacienteEncontrado) {
          setErro("Paciente não encontrado.");
          return;
        }

        setFormulario({
          nombre: pacienteEncontrado.nombre,
          apellido: pacienteEncontrado.apellido,
          email: pacienteEncontrado.email,
          telefono: pacienteEncontrado.telefono,
          fechaNacimiento: formatarDataParaInput(
            pacienteEncontrado.fechaNacimiento,
          ),
        });
      } catch (error: unknown) {
        setErro(extraerMensajeError(error));
        if (!ativo) return;

        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
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
            setErro("Não foi possível conectar à API.");
          }
        } else {
          setErro("Ocorreu um erro inesperado ao carregar o paciente.");
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    void carregarPaciente();

    return () => {
      ativo = false;
    };
  }, [id, carregarPacientes]);

  function handleChange(evento: ChangeEvent<HTMLInputElement>) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  function handleCancelar() {
    if (!paciente) return;

    setFormulario({
      nombre: paciente.nombre,
      apellido: paciente.apellido,
      email: paciente.email,
      telefono: paciente.telefono,
      fechaNacimiento: formatarDataParaInput(paciente.fechaNacimiento),
    });

    setErro("");
    setEditando(false);
  }

  async function handleSalvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (!id || !paciente || salvando) return;

    setSalvando(true);
    setErro("");

    try {
      const atualizado = await atualizarPaciente(Number(id), {
        nombre: formulario.nombre.trim(),
        apellido: formulario.apellido.trim(),
        email: formulario.email.trim(),
        telefono: formulario.telefono.trim(),
        fechaNacimiento: formulario.fechaNacimiento,
      });

      setFormulario({
        nombre: atualizado.nombre,
        apellido: atualizado.apellido,
        email: atualizado.email,
        telefono: atualizado.telefono,
        fechaNacimiento: formatarDataParaInput(atualizado.fechaNacimiento),
      });

      setEditando(false);
      toast.success("Paciente actualizado con exito!");
    } catch (error: unknown) {
      setErro(extraerMensajeError(error));
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          setErro("Confira os dados preenchidos e tente novamente.");
        } else if (error.response?.status === 401) {
          setErro("Sua sessão expirou. Faça login novamente.");
        } else if (error.response?.status === 403) {
          setErro("Você não tem permissão para editar pacientes.");
        } else if (error.response?.status === 404) {
          setErro("Este paciente não foi encontrado.");
        } else if (error.response?.status === 409) {
          setErro(
            "Não foi possível atualizar. Verifique se o e-mail já está cadastrado.",
          );
        } else if (!error.response) {
          setErro("Não foi possível conectar à API.");
        } else {
          setErro(
            error.response.data?.error ??
              `Erro ao atualizar o paciente (HTTP ${error.response.status}).`,
          );
        }
      } else {
        setErro("Ocorreu um erro inesperado ao atualizar o paciente.");
      }

      toast.error("Não foi possível salvar as alterações.");
    } finally {
      setSalvando(false);
    }
  }

  const campoClasse =
    "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100";

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
            <p className="font-semibold">
              {paciente
                ? "Não foi possível salvar as alterações"
                : "Não foi possível abrir os detalhes"}
            </p>
            <p className="mt-1 text-sm">{erro}</p>
          </div>
        )}

        {!carregando && paciente && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {!editando ? (
              <>
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
                      {new Date(paciente.fechaNacimiento).toLocaleDateString(
                        "pt-BR",
                        { timeZone: "UTC" },
                      )}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setErro("");
                    setEditando(true);
                  }}
                  className="mt-8 rounded-lg bg-teal-700 px-5 py-2.5 font-semibold text-white transition hover:bg-teal-800"
                >
                  Editar paciente
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-slate-900">
                  Editar dados do paciente
                </h2>

                <form onSubmit={handleSalvar} className="mt-6 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="nombre"
                        className="text-sm font-medium text-slate-700"
                      >
                        Nome
                      </label>
                      <input
                        id="nombre"
                        name="nombre"
                        value={formulario.nombre}
                        onChange={handleChange}
                        className={campoClasse}
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="apellido"
                        className="text-sm font-medium text-slate-700"
                      >
                        Sobrenome
                      </label>
                      <input
                        id="apellido"
                        name="apellido"
                        value={formulario.apellido}
                        onChange={handleChange}
                        className={campoClasse}
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-slate-700"
                      >
                        E-mail
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formulario.email}
                        onChange={handleChange}
                        className={campoClasse}
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="telefono"
                        className="text-sm font-medium text-slate-700"
                      >
                        Telefone
                      </label>
                      <input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        value={formulario.telefono}
                        onChange={handleChange}
                        className={campoClasse}
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="fechaNacimiento"
                        className="text-sm font-medium text-slate-700"
                      >
                        Data de nascimento
                      </label>
                      <input
                        id="fechaNacimiento"
                        name="fechaNacimiento"
                        type="date"
                        value={formulario.fechaNacimiento}
                        onChange={handleChange}
                        max={new Date().toLocaleDateString("en-CA")}
                        className={campoClasse}
                        required
                      />
                    </div>
                  </div>

                  {erro && (
                    <p
                      role="alert"
                      className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                    >
                      {erro}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={salvando}
                      className="rounded-lg bg-teal-700 px-5 py-2.5 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {salvando ? "Salvando..." : "Salvar alterações"}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelar}
                      disabled={salvando}
                      className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
