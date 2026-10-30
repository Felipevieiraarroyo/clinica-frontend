import { useCitasStore } from "../stores/citasStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { citaSchema, type CitaformData } from "../schema/citaSchema";
import { useMedicos } from "../hooks/useMedicos";
import "./FormularioCita.css";
import { usePacientes } from "../hooks/usePacientes";
import { crearCita } from "../services/citas.service";
import { useState } from "react";

export function FormularioCita() {
  const { medicos, cargando } = useMedicos();
  const {
    pacientes,
    cargando: cargandoPacientes,
    error: errorPacientes,
  } = usePacientes();
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
  const citaAgendada = useCitasStore((state) => state.citaSeleccionada);
  const agregarCita = useCitasStore((state) => state.agregarCita);
  const seleccionarCita = useCitasStore((state) => state.seleccionar);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CitaformData>({
    resolver: zodResolver(citaSchema),
    defaultValues: {
      pacienteId: "",
      medicoId: "",
      fecha: "",
      hora: "",
      motivo: "",
      urgencia: "media",
    },
  });

  const onSubmit = async (datos: CitaformData) => {
    try {
      setErrorEnvio(null);

      const fechaHora = new Date(
        `${datos.fecha}T${datos.hora}:00`,
      ).toISOString();

      await crearCita({
        pacienteId: Number(datos.pacienteId),
        medicoId: Number(datos.medicoId),
        fechaHora,
      });

      // Mantém os dados no Zustand para exibir a confirmação.
      // O cadastro real já foi realizado pela API.
      const novaCita = agregarCita(datos);
      seleccionarCita(novaCita.id);
    } catch (error) {
      console.error("Error al agendar la cita:", error);
      setErrorEnvio(
        "No fue posible agendar la cita. Verifica los datos e intenta nuevamente.",
      );
    }
  };

  const agendarOtraCita = () => {
    reset();
    setErrorEnvio(null);
    seleccionarCita("");
  };

  if (citaAgendada) {
    const medico = medicos.find(
      (item) => String(item.id) === citaAgendada.medicoId,
    );

    const paciente = pacientes.find(
      (item) => String(item.id) === citaAgendada.pacienteId,
    );

    return (
      <section className="cita-container">
        <div className="cita-confirmacion">
          <div className="cita-icono-exito" aria-hidden="true">
            ✓
          </div>
          <h2>¡Cita agendada con éxito!</h2>
          <p>Los datos de la consulta se registraron correctamente.</p>

          <div className="cita-resumen">
            <p>
              <strong>Paciente:</strong>{" "}
              {paciente
                ? `${paciente.nombre} ${paciente.apellido}`
                : "Paciente no encontrado"}
            </p>
            <p>
              <strong>Médico:</strong> {medico?.nombre ?? "No encontrado"}
            </p>
            <p>
              <strong>Especialidad:</strong>{" "}
              {medico?.especialidad.nombre ?? "—"}
            </p>
            <p>
              <strong>Fecha:</strong> {citaAgendada.fecha}
            </p>
            <p>
              <strong>Hora:</strong> {citaAgendada.hora}
            </p>
            <p>
              <strong>Motivo:</strong> {citaAgendada.motivo}
            </p>
            <p>
              <strong>Urgencia:</strong> {citaAgendada.urgencia}
            </p>
          </div>

          <button type="button" onClick={agendarOtraCita}>
            Agendar otra cita
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="cita-container">
      <div className="cita-cabecera">
        <h2>Nueva cita médica</h2>
        <p>Completa los datos para agendar una consulta.</p>
      </div>

      <form
        className="cita-formulario"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="cita-campo">
          <label htmlFor="pacienteId">Nombre del paciente</label>

          <select
            id="pacienteId"
            className={errors.pacienteId ? "cita-input invalido" : "cita-input"}
            aria-invalid={Boolean(errors.pacienteId)}
            disabled={cargandoPacientes}
            {...register("pacienteId")}
          >
            <option value="">
              {cargandoPacientes
                ? "Cargando pacientes..."
                : "Selecciona un paciente"}
            </option>

            {pacientes.map((paciente) => (
              <option key={paciente.id} value={paciente.id}>
                {paciente.nombre} {paciente.apellido}
              </option>
            ))}
          </select>

          {errorPacientes && <p className="cita-error">{errorPacientes}</p>}

          {errors.pacienteId && (
            <p className="cita-error">{errors.pacienteId.message}</p>
          )}
        </div>

        <div className="cita-campo">
          <label htmlFor="medicoId">Médico</label>
          <select
            id="medicoId"
            className={errors.medicoId ? "cita-input invalido" : "cita-input"}
            aria-invalid={Boolean(errors.medicoId)}
            disabled={cargando}
            {...register("medicoId")}
          >
            <option value="">
              {cargando ? "Cargando médicos..." : "Selecciona un médico"}
            </option>
            {medicos.map((medico) => (
              <option key={medico.id} value={medico.id}>
                {medico.nombre} {medico.apellido} — {medico.especialidad.nombre}
              </option>
            ))}
          </select>
          {errors.medicoId && (
            <p className="cita-error">{errors.medicoId.message}</p>
          )}
        </div>

        <div className="cita-fila">
          <div className="cita-campo">
            <label htmlFor="fecha">Fecha</label>
            <input
              id="fecha"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className={errors.fecha ? "cita-input invalido" : "cita-input"}
              aria-invalid={Boolean(errors.fecha)}
              {...register("fecha")}
            />
            {errors.fecha && (
              <p className="cita-error">{errors.fecha.message}</p>
            )}
          </div>

          <div className="cita-campo">
            <label htmlFor="hora">Hora</label>
            <input
              id="hora"
              type="time"
              className={errors.hora ? "cita-input invalido" : "cita-input"}
              aria-invalid={Boolean(errors.hora)}
              {...register("hora")}
            />
            {errors.hora && <p className="cita-error">{errors.hora.message}</p>}
          </div>
        </div>

        <div className="cita-campo">
          <label htmlFor="motivo">Motivo de la consulta</label>
          <textarea
            id="motivo"
            rows={4}
            maxLength={500}
            placeholder="Describe el motivo (entre 10 y 500 caracteres)"
            className={errors.motivo ? "cita-input invalido" : "cita-input"}
            aria-invalid={Boolean(errors.motivo)}
            {...register("motivo")}
          />
          {errors.motivo && (
            <p className="cita-error">{errors.motivo.message}</p>
          )}
        </div>

        <div className="cita-campo">
          <label htmlFor="urgencia">Nivel de urgencia</label>
          <select
            id="urgencia"
            className={errors.urgencia ? "cita-input invalido" : "cita-input"}
            aria-invalid={Boolean(errors.urgencia)}
            {...register("urgencia")}
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="critica">Crítica</option>
          </select>
          {errors.urgencia && (
            <p className="cita-error">{errors.urgencia.message}</p>
          )}
        </div>
        {errorEnvio && (
          <p className="cita-error" role="alert">
            {errorEnvio}
          </p>
        )}
        <button
          type="submit"
          className="cita-boton"
          disabled={isSubmitting || cargando || cargandoPacientes}
        >
          {isSubmitting ? "Agendando..." : "Agendar cita"}
        </button>
      </form>
    </section>
  );
}
