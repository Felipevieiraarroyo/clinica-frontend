import { z } from "zod";

const hoy = () => {
  const fecha = new Date();
  const ano = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
};

export const citaSchema = z.object({
  pacienteNombre: z
    .string()
    .trim()
    .min(3, "El nombre del paciente debe tener al menos 3 caracteres"),

  medicoId: z.string().min(1, "Seleccione un medico"),

  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe una fecha valida")
    .refine((fecha) => {
      const data = new Date(`${fecha}T12:00:00`);
      return (
        !Number.isNaN(data.getTime()) &&
        data.toISOString().slice(0, 10) === fecha
      );
    }, "Informe una fecha valida")
    .refine((fecha) => fecha >= hoy(), {
      message: "La fecha no puede estar en el pasado",
    }),

  hora: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):[0-5]\d$/,
      "Informe una hora valida entre 00:00 y 23:59",
    ),

  motivo: z
    .string()
    .trim()
    .min(10, "El motivo no puede tener menos que 10 caracteres")
    .max(500, "El motivo no puede tener mas que 500 caracteres"),

  urgencia: z.enum(["baja", "media", "alta", "critica"], {
    error: "Seleccione el nivel de urgencia",
  }),
});

export type CitaformData = z.infer<typeof citaSchema>;
