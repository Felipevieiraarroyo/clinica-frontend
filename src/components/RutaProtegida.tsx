import { Navigate, Outlet } from "react-router-dom";

export function RotaProtegida() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
