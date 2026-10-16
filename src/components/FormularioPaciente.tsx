import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { EstadoPaciente, Paciente } from "../types/paciente";

interface FormularioPacienteProps {
  onAgregar: (paciente: Paciente) => void;
}

export function FormularioPaciente({ onAgregar }: FormularioPacienteProps) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<EstadoPaciente>("activo");
  const [error, setError] = useState("");

  const limpiarFormulario = () => {
    setNombre("");
    setApellido("");
    setEmail("");
    setEstado("activo");
    setError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!nombre.trim() || !email.trim()) {
      setError("Nombre y email son obligatorios");
      return;
    }

    const nuevoPaciente: Paciente = {
      id: crypto.randomUUID(),
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.trim(),
      estado,
      telefono: "No registrado",
      especialidadAsignada: "Sin asignar",
      ultimaCita: "Sin citas",
    };

    onAgregar(nuevoPaciente);
    limpiarFormulario();
  };

  const handleNombreChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNombre(event.target.value);
    setError("");
  };

  const handleApellidoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setApellido(event.target.value);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setError("");
  };

  const handleEstadoChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setEstado(event.target.value as EstadoPaciente);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-lg font-bold text-slate-900">Agregar paciente</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm font-medium text-slate-700">
          Nombre *
          <input
            value={nombre}
            onChange={handleNombreChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Nombre"
          />
          {!nombre.trim() && error && (
            <span className="block text-red-600">{error}</span>
          )}
        </label>

        <label className="space-y-1 text-sm font-medium text-slate-700">
          Apellido
          <input
            value={apellido}
            onChange={handleApellidoChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Apellido"
          />
        </label>

        <label className="space-y-1 text-sm font-medium text-slate-700 sm:col-span-2">
          Email *
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="correo@ejemplo.com"
          />
          {!email.trim() && error && (
            <span className="block text-red-600">{error}</span>
          )}
        </label>

        <label className="space-y-1 text-sm font-medium text-slate-700 sm:col-span-2">
          Estado
          <select
            value={estado}
            onChange={handleEstadoChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="en_espera">En espera</option>
          </select>
        </label>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white hover:bg-teal-800"
      >
        Agregar paciente
      </button>
    </form>
  );
}
