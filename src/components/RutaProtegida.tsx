import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

interface RotaProtegidaProps {
  allowedRoles?: string[];
}

export function RotaProtegida({ allowedRoles }: RotaProtegidaProps) {
  const token = useAuthStore((state) => state.token);
  const usuario = useAuthStore((state) => state.usuario);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!usuario || !allowedRoles.includes(usuario.rol))) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return <Outlet />;
}
