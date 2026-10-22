import { useState, type FormEvent } from "react";
import axios from "axios";
import { usePacientesStore } from "../stores/pacientesStore";
import type { Paciente } from "../services/pacientes.service";

interface FormularioPacienteProps {
  onPacienteCriado: (paciente: Paciente) => void;
}

export function FormularioPaciente({
  onPacienteCriado,
}: FormularioPacienteProps) {
  const crearPaciente = usePacientesStore((state) => state.crear);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function limparFormulario() {
    setNombre("");
    setApellido("");
    setEmail("");
    setTelefono("");
    setFechaNacimiento("");
    setErro("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const paciente = await crearPaciente({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim(),
        telefono: telefono.trim(),
        fechaNacimiento,
      });

      onPacienteCriado(paciente);
      limparFormulario();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          const detalhes = error.response.data?.details;
          setErro(
            Array.isArray(detalhes)
              ? detalhes
                  .map((item: { message: string }) => item.message)
                  .join(" ")
              : "Confira os dados preenchidos.",
          );
        } else if (error.response?.status === 401) {
          setErro("Sua sessão expirou. Faça login novamente.");
        } else if (error.response?.status === 403) {
          setErro("Seu usuário não tem permissão para cadastrar pacientes.");
        } else {
          setErro(
            error.response?.data?.error ??
              "Não foi possível cadastrar o paciente.",
          );
        }
      } else {
        setErro("Ocorreu um erro inesperado.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-lg font-bold text-slate-900">
        Cadastrar novo paciente
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm font-medium text-slate-700">
          Nome *
          <input
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Nome"
          />
        </label>

        <label className="space-y-1 text-sm font-medium text-slate-700">
          Sobrenome *
          <input
            value={apellido}
            onChange={(event) => setApellido(event.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Sobrenome"
          />
        </label>

        <label className="space-y-1 text-sm font-medium text-slate-700">
          E-mail *
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="paciente@exemplo.com"
          />
        </label>

        <label className="space-y-1 text-sm font-medium text-slate-700">
          Telefone *
          <input
            type="tel"
            value={telefono}
            onChange={(event) => setTelefono(event.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Telefone"
          />
        </label>

        <label className="space-y-1 text-sm font-medium text-slate-700 sm:col-span-2">
          Data de nascimento *
          <input
            type="date"
            value={fechaNacimiento}
            onChange={(event) => setFechaNacimiento(event.target.value)}
            max={new Date().toLocaleDateString("sv-SE")}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
      </div>

      {erro && (
        <p role="alert" className="text-sm text-red-600">
          {erro}
        </p>
      )}

      <button
        type="submit"
        disabled={carregando}
        className="rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
      >
        {carregando ? "Cadastrando..." : "Cadastrar paciente"}
      </button>
    </form>
  );
}
