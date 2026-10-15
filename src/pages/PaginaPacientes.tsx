/*
 *  Problemas encontrados en el código generado por IA:
 * 1. La manipulación directa del DOM dificulta el control de la interfaz en React.
 * 2. La lógica estaba mezclada con el HTML.
 * 3. La interfaz no estaba dividida en componentes reutilizables.
 * 4. Los estados de los pacientes no están protegidos por tipos específicos.
 */

import { useState } from "react";
import type { EstadoPaciente, Paciente } from "../types/paciente";
import { PacienteRow } from "../components/PacienteRow";
import { BuscadorPacientes } from "../components/BuscadorPacientes";
import { BadgeEstado } from "../components/BadgeEstado";
import { FormularioPaciente } from "../components/FormularioPaciente";

const pacientesIniciales: Paciente[] = [
  {
    id: "1",
    nombre: "Sofía",
    apellido: "Navarro",
    email: "sofia.navarro@example.com",
    telefono: "+34 612 345 678",
    especialidadAsignada: "Cardiología",
    ultimaCita: "12/10/2026",
    estado: "activo",
  },
  {
    id: "2",
    nombre: "Carlos",
    apellido: "Mendoza",
    email: "carlos.mendoza@example.com",
    telefono: "+34 623 456 789",
    especialidadAsignada: "Traumatología",
    ultimaCita: "10/10/2026",
    estado: "en_espera",
  },
  {
    id: "3",
    nombre: "Elena",
    apellido: "Vargas",
    email: "elena.vargas@example.com",
    telefono: "+34 634 567 890",
    especialidadAsignada: "Pediatría",
    ultimaCita: "08/10/2026",
    estado: "activo",
  },
  {
    id: "4",
    nombre: "Javier",
    apellido: "Ortiz",
    email: "javier.ortiz@example.com",
    telefono: "+34 645 678 901",
    especialidadAsignada: "Neurología",
    ultimaCita: "01/10/2026",
    estado: "inactivo",
  },
  {
    id: "5",
    nombre: "Lucía",
    apellido: "Paredes",
    email: "lucia.paredes@example.com",
    telefono: "+34 656 789 012",
    especialidadAsignada: "Dermatología",
    ultimaCita: "29/09/2026",
    estado: "activo",
  },
];

export function PaginaPacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>(pacientesIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<"Todos" | EstadoPaciente>(
    "Todos",
  );

  const agregarPaciente = (nuevoPaciente: Paciente) => {
    setPacientes((prev) => [...prev, nuevoPaciente]);
  };

  const cambiarEstadoPaciente = (id: string, nuevoEstado: EstadoPaciente) => {
    setPacientes((prev) =>
      prev.map((paciente) =>
        paciente.id === id ? { ...paciente, estado: nuevoEstado } : paciente,
      ),
    );
  };

  const eliminarPaciente = (id: string) => {
    setPacientes((prev) => prev.filter((paciente) => paciente.id !== id));
  };

  const pacientesFiltrados = pacientes.filter((paciente) => {
    const texto = busqueda.trim().toLowerCase();

    const coincideNombre = `${paciente.nombre} ${paciente.apellido}`
      .toLowerCase()
      .includes(texto);

    const coincideEstado =
      estadoFiltro === "Todos" || paciente.estado === estadoFiltro;

    return coincideNombre && coincideEstado;
  });

  const cantidadActivos = pacientes.filter(
    (paciente) => paciente.estado === "activo",
  ).length;

  const cantidadInactivos = pacientes.filter(
    (paciente) => paciente.estado === "inactivo",
  ).length;

  const cantidadEnEspera = pacientes.filter(
    (paciente) => paciente.estado === "en_espera",
  ).length;

  const limpiarFiltros = () => {
    setBusqueda("");
    setEstadoFiltro("Todos");
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
            Consulta y gestiona la información de tus pacientes.
          </p>
        </header>

        <section
          aria-label="Resumen de pacientes"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total de pacientes</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {pacientes.length}
            </p>
          </article>

          <article className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Activos</p>
            <p className="mt-2 text-3xl font-bold text-emerald-700">
              {cantidadActivos}
            </p>
          </article>

          <article className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">En espera</p>
            <p className="mt-2 text-3xl font-bold text-amber-700">
              {cantidadEnEspera}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Inactivos</p>
            <p className="mt-2 text-3xl font-bold text-slate-600">
              {cantidadInactivos}
            </p>
          </article>
        </section>
        <section>
          <FormularioPaciente onAgregar={agregarPaciente} />
        </section>
        <section className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-full sm:max-w-xl sm:flex-1">
              <BuscadorPacientes value={busqueda} onChange={setBusqueda} />
            </div>

            <select
              value={estadoFiltro}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                setEstadoFiltro(event.target.value as "Todos" | EstadoPaciente)
              }
              aria-label="Filtrar por estado"
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              <option value="Todos">Todos</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="en_espera">En espera</option>
            </select>

            <button
              type="button"
              onClick={limpiarFiltros}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Limpiar filtros
            </button>
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-\[850px] text-left">
                <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Paciente</th>
                    <th className="px-5 py-4">Teléfono</th>
                    <th className="px-5 py-4">Especialidad asignada</th>
                    <th className="px-5 py-4">Última cita</th>
                    <th className="px-5 py-4">Estado</th>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {pacientesFiltrados.map((paciente) => (
                    <tr
                      key={paciente.id}
                      className="transition hover:bg-slate-50"
                    >
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
                        {paciente.especialidadAsignada}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {paciente.ultimaCita}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-col items-start gap-2">
                          <BadgeEstado estado={paciente.estado} />

                          <select
                            value={paciente.estado}
                            onChange={(event) =>
                              cambiarEstadoPaciente(
                                paciente.id,
                                event.target.value as EstadoPaciente,
                              )
                            }
                            aria-label={`Cambiar estado de ${paciente.nombre}`}
                            className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700 focus:border-teal-500 focus:outline-none"
                          >
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                            <option value="en_espera">En espera</option>
                          </select>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => {
                            const confirmar = window.confirm(
                              `¿Seguro que deseas eliminar a ${paciente.nombre} ${paciente.apellido}?`,
                            );

                            if (confirmar) {
                              eliminarPaciente(paciente.id);
                            }
                          }}
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:hidden">
            {pacientesFiltrados.map((paciente) => (
              <PacienteRow
                key={paciente.id}
                paciente={paciente}
                onCambiarEstado={cambiarEstadoPaciente}
                onEliminar={eliminarPaciente}
              />
            ))}
          </div>

          {pacientesFiltrados.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
              <p className="font-semibold text-slate-800">
                No se encontraron pacientes
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Prueba con otro nombre, apellido o correo electrónico.
              </p>
            </div>
          )}

          <p className="text-sm text-slate-500" aria-live="polite">
            {pacientesFiltrados.length} paciente(s) encontrado(s)
          </p>
        </section>
      </div>
    </main>
  );
}
