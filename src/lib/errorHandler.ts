import axios from "axios";

interface DadosErroAPI {
  message?: unknown;
  error?: unknown;
}

function obterTexto(valor: unknown): string | null {
  if (typeof valor === "string" && valor.trim()) {
    return valor;
  }

  if (
    Array.isArray(valor) &&
    valor.every((item): item is string => typeof item === "string")
  ) {
    return valor.join(" ");
  }

  return null;
}

export function extraerMensajeError(err: unknown): string {
  if (axios.isAxiosError<DadosErroAPI>(err)) {
    const dados = err.response?.data;

    const mensagem = obterTexto(dados?.message) ?? obterTexto(dados?.error);

    if (mensagem) {
      return mensagem;
    }

    if (err.response) {
      return `Erro do servidor (HTTP ${err.response.status}).`;
    }

    return "Não foi possível conectar à API.";
  }

  if (err instanceof Error) {
    return err.message;
  }

  return "Erro inesperado.";
}
