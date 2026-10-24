import { Navigate, Outlet } from "react-router-dom";
import { obterPerfilToken, type Role } from "../lib/auth";

interface RotaProtegidaProps {
  allowedRoles?: Role[];
}

export function RotaProtegida({ allowedRoles }: RotaProtegidaProps) {
  const token = localStorage.getItem("token");
  const perfil = obterPerfilToken();

  // Sem token válido, volta para o login.
  if (!token || !perfil) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  // Com token válido, mas sem permissão, bloqueia a página.
  if (allowedRoles && !allowedRoles.includes(perfil)) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return <Outlet />;
}
