import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { citaSchema, type CitaformData } from "../schema/citaSchema";
import { useMedicos } from "../hooks/useMedicos";
import "./FormularioCita.css";

export function FormularioCita() {
  const { medicos, cargando } = useMedicos();
  const [citaAgendada, setCitaAgendada] = useState<CitaformData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CitaformData>({
    resolver: zodResolver(citaSchema),
    defaultValues: {
      pacienteNombre: "",
      medicoId: "",
      fecha: "",
      hora: "",
      motivo: "",
      urgencia: "media",
    },
  });

  const onSubmit = async (datos: CitaformData) => {
    await new Promise<void>((resolve) => setTimeout(resolve, 1500));
    setCitaAgendada(datos);
  };

  const agendarOtraCita = () => {
    reset();
    setCitaAgendada(null);
  };

  if (citaAgendada) {
    const medico = medicos.find((item) => item.id === citaAgendada.medicoId);

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
              <strong>Paciente:</strong> {citaAgendada.pacienteNombre}
            </p>
            <p>
              <strong>Médico:</strong> {medico?.nombre ?? "No encontrado"}
            </p>
            <p>
              <strong>Especialidad:</strong> {medico?.especialidad ?? "—"}
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
          <label htmlFor="pacienteNombre">Nombre del paciente</label>
          <input
            id="pacienteNombre"
            type="text"
            placeholder="Nombre completo"
            className={
              errors.pacienteNombre ? "cita-input invalido" : "cita-input"
            }
            aria-invalid={Boolean(errors.pacienteNombre)}
            {...register("pacienteNombre")}
          />
          {errors.pacienteNombre && (
            <p className="cita-error">{errors.pacienteNombre.message}</p>
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
                {medico.nombre} — {medico.especialidad}
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

        <button
          type="submit"
          className="cita-boton"
          disabled={isSubmitting || cargando}
        >
          {isSubmitting ? "Agendando..." : "Agendar cita"}
        </button>
      </form>
    </section>
  );
}
