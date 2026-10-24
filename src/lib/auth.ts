export type Role = "RECEPCIONISTA" | "MEDICO" | "GERENCIA";

interface PayloadToken {
  id: number;
  email: string;
  role: Role;
  exp?: number;
}

const ROLES_VALIDOS: Role[] = ["RECEPCIONISTA", "MEDICO", "GERENCIA"];

export function obterPerfilToken(): Role | null {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    const parteToken = token.split(".")[1];

    if (!parteToken) {
      return null;
    }

    const base64 = parteToken
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(parteToken.length / 4) * 4, "=");

    const bytes = Uint8Array.from(atob(base64), (caractere) =>
      caractere.charCodeAt(0),
    );

    const payload = JSON.parse(
      new TextDecoder().decode(bytes),
    ) as Partial<PayloadToken>;

    if (
      !Number.isInteger(payload.id) ||
      typeof payload.email !== "string" ||
      !ROLES_VALIDOS.includes(payload.role as Role)
    ) {
      return null;
    }

    if (typeof payload.exp === "number" && payload.exp * 1000 <= Date.now()) {
      return null;
    }

    return payload.role as Role;
  } catch {
    return null;
  }
}
