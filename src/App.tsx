import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { RotaProtegida } from "./components/RutaProtegida";
import { PaginaLogin } from "./pages/PaginaLogin";
import { PaginaDashboard } from "./pages/PaginaDashboard";
import { PaginaPacientes } from "./pages/PaginaPacientes";
import { PaginaDetallePaciente } from "./pages/PaginaDetallePaciente";
import { PaginaNuevaCita } from "./pages/PaginaNuevaCita";
import { PaginaNotFound } from "./pages/PaginaNotFound";
import { PaginaAcessoNegado } from "./pages/PaginaAcessoNegado";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PaginaLogin />} />
      <Route path="/acesso-negado" element={<PaginaAcessoNegado />} />

      <Route element={<RotaProtegida />}>
        <Route element={<Layout />}>
          {/* Dashboard: Gerência e Recepcionista */}
          <Route
            element={
              <RotaProtegida allowedRoles={["GERENCIA", "RECEPCIONISTA"]} />
            }
          >
            <Route index element={<PaginaDashboard />} />
          </Route>

          {/* Pacientes e novas consultas: somente Recepcionista */}
          <Route element={<RotaProtegida allowedRoles={["RECEPCIONISTA"]} />}>
            <Route path="pacientes" element={<PaginaPacientes />} />
            <Route path="pacientes/:id" element={<PaginaDetallePaciente />} />
            <Route path="citas/nueva" element={<PaginaNuevaCita />} />
          </Route>

          <Route path="*" element={<PaginaNotFound />} />
        </Route>
      </Route>

      {/* Redirecionamento de endereços externos ao sistema */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
