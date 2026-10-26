import axios from "axios";

export function extraerMensajeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const mensaje = error.response?.data?.message;

    if (typeof mensaje === "string" && mensaje.trim()) {
      return mensaje;
    }

    if (error.response?.status === 401) {
      return "El email o la contraseña son incorrectos.";
    }

    if (!error.response) {
      return "No fue posible conectar al servidor.";
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Ocurrió un error inesperado.";
}
