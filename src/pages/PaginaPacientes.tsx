/*
 *  Problemas encontrados en el código generado por IA:
 * 1. La manipulación directa del DOM dificulta el control de la interfaz en React.
 * 2. La lógica estaba mezclada con el HTML.
 * 3. La interfaz no estaba dividida en componentes reutilizables.
 * 4. Los estados de los pacientes no están protegidos por tipos específicos.
 */

import { useState } from "react";
import type { Paciente } from "../types/paciente";
import { PacienteRow } from "../components/PacienteRow";
import { BuscadorPacientes } from "../components/BuscadorPacientes";
import { BadgeEstado } from "../components/BadgeEstado";

const pacientes: Paciente[] = [
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
  const [busqueda, setBusqueda] = useState("");

  const pacientesFiltrados = pacientes.filter((paciente) => {
    const texto = busqueda.trim().toLowerCase();

    return (
      paciente.nombre.toLowerCase().includes(texto) ||
      paciente.apellido.toLowerCase().includes(texto) ||
      paciente.email.toLowerCase().includes(texto)
    );
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

        <section className="space-y-5">
          <div className="max-w-xl">
            <BuscadorPacientes value={busqueda} onChange={setBusqueda} />
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
                        <BadgeEstado estado={paciente.estado} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:hidden">
            {pacientesFiltrados.map((paciente) => (
              <PacienteRow key={paciente.id} paciente={paciente} />
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

          <p className="text-sm text-slate-500">
            Mostrando {pacientesFiltrados.length} de {pacientes.length}{" "}
            pacientes.
          </p>
        </section>
      </div>
    </main>
  );
}
